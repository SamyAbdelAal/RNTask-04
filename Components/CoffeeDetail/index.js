import React, { Component } from "react";
import { connect } from "react-redux";
import { AsyncStorage } from "react-native";

// NativeBase Components
import {
  Thumbnail,
  Text,
  Button,
  Left,
  Body,
  Right,
  Icon,
  List,
  ListItem,
  Picker,
  Content
} from "native-base";

// Style
import styles from "./styles";

// Actions
import { addItemToCart } from "../../store/actions/cartActions";
import { quantityCounter } from "../../utilities/quantityCounter";

class CoffeeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drink: "Coffee",
      option: "Small",
      logged: false
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("shop", {}).name,
    headerRight: (
      <Button
        light
        transparent
        onPress={
          navigation.getParam("isAuthed")
            ? () => navigation.navigate("CoffeeCart")
            : () => navigation.replace("Login")
        }
      >
        <Text>
          {navigation.getParam("quantity", 0)}{" "}
          <Icon
            type="FontAwesome"
            name="coffee"
            style={{ color: "white", fontSize: 15 }}
          />
        </Text>
      </Button>
    )
  });

  componentDidMount() {
    AsyncStorage.getItem("token").then(token => {
      if (token) {
        this.setState({ logged: true });
      } else {
        this.setState({ logged: false });
      }
      this.props.navigation.setParams({
        quantity: this.props.quantity,
        isAuthed: this.state.logged
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.quantity != this.props.quantity) {
      this.props.navigation.setParams({ quantity: this.props.quantity });
    }
  }

  changeDrink(value) {
    this.setState({
      drink: value
    });
  }

  changeOption(value) {
    this.setState({
      option: value
    });
  }

  handleAdd() {
    const { drink, option } = this.state;
    const { list } = this.props.cart;
    let item = {
      drink: drink,
      option: option,
      quantity: 1
    };
    this.props.addItemToCart(item, list);
  }

  render() {
    const coffeeshop = this.props.navigation.getParam("shop", {});
    return (
      <Content>
        <List>
          <ListItem style={styles.top}>
            <Left>
              <Text style={styles.text}>
                {coffeeshop.name + "\n"}
                <Text note>{coffeeshop.location}</Text>
              </Text>
            </Left>
            <Body />
            <Right>
              <Thumbnail bordered source={{ uri: coffeeshop.img }} />
            </Right>
          </ListItem>
          <ListItem style={{ borderBottomWidth: 0 }}>
            <Left>
              <Picker
                note
                mode="dropdown"
                style={{ width: 150 }}
                selectedValue={this.state.drink}
                onValueChange={this.changeDrink.bind(this)}
              >
                <Picker.Item label="Coffee" value="Coffee" />
                <Picker.Item label="Lattee" value="Lattee" />
                <Picker.Item label="Espresso" value="Espresso" />
              </Picker>
            </Left>
            <Body>
              <Picker
                note
                mode="dropdown"
                style={{ width: 150 }}
                selectedValue={this.state.option}
                onValueChange={this.changeOption.bind(this)}
              >
                <Picker.Item label="Small" value="Small" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Large" value="Large" />
              </Picker>
            </Body>
          </ListItem>
          <Button full danger onPress={() => this.handleAdd()}>
            <Text>Add</Text>
          </Button>
        </List>
      </Content>
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cart,
  quantity: quantityCounter(state.cart.list)
});

const mapActionsToProps = dispatch => ({
  addItemToCart: (item, cart) => dispatch(addItemToCart(item, cart))
});

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CoffeeDetail);
