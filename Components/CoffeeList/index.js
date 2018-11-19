import React, { Component } from "react";
import { ImageBackground, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/authActions";
import { AsyncStorage } from "react-native";

// NativeBase Components
import {
  List,
  ListItem,
  Card,
  CardItem,
  Button,
  Thumbnail,
  Text,
  Left,
  Content,
  Icon,
  Footer
} from "native-base";

// Style
import styles from "./styles";

// Actions
import { quantityCounter } from "../../utilities/quantityCounter";

class CoffeeList extends Component {
  constructor(props) {
    super(props);
    this.state = { logged: false };
  }
  static navigationOptions = ({ navigation }) => ({
    title: "Coffee List",
    headerLeft: null,
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
    if (prevProps.quantity !== this.props.quantity) {
      this.props.navigation.setParams({ quantity: this.props.quantity });
    }
  }

  handlePress(shop) {
    this.props.navigation.navigate("CoffeeDetail", {
      shop: shop,
      quantity: this.props.quantity
    });
  }

  renderItem(shop) {
    return (
      <TouchableOpacity key={shop.id} onPress={() => this.handlePress(shop)}>
        <ImageBackground
          source={{ uri: shop.background }}
          style={styles.background}
        >
          <View style={styles.overlay} />
          <ListItem style={styles.transparent}>
            <Card style={styles.transparent}>
              <CardItem style={styles.transparent}>
                <Left>
                  <Thumbnail
                    bordered
                    source={{ uri: shop.img }}
                    style={styles.thumbnail}
                  />
                  <Text style={styles.text}>{shop.name}</Text>
                  <Text note style={styles.text}>
                    {shop.distance}
                  </Text>
                </Left>
              </CardItem>
            </Card>
          </ListItem>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
  render() {
    const { coffeeshops } = this.props.coffee;
    let ListItems;
    if (coffeeshops) {
      ListItems = coffeeshops.map(shop => this.renderItem(shop));
    }
    return (
      <Content>
        <List>{ListItems}</List>
        <Footer style={{ backgroundColor: "transparent" }}>
          {this.state.logged ? (
            <Button
              danger
              onPress={() => {
                this.props.logout(this.props.navigation);
              }}
            >
              <Text>Logout</Text>
            </Button>
          ) : (
            <Button
              danger
              onPress={() => {
                this.props.navigation.replace("Login");
              }}
            >
              <Text>Login</Text>
            </Button>
          )}
        </Footer>
      </Content>
    );
  }
}

const mapStateToProps = state => ({
  coffee: state.coffee,
  quantity: quantityCounter(state.cart.list),
  isAuthed: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  logout: history => dispatch(actionCreators.logout(history))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoffeeList);
