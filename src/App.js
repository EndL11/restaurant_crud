import React from 'react';
import './App.css';
import Table from './components/Table/Table';

const uuidv4 = require('uuid/v4');

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      menu:{"Salad": 3.50, "Sushi": 9.65, "Pizza": 12.30},
      orderList: [
        
      ],
      show_modal: false,
      isEditing: false,
      editingObj: null,
      editingIndex: null
    }
    this.onEdit = this.onEdit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.applyEdit = this.applyEdit.bind(this);
    this.refuseEdit = this.refuseEdit.bind(this);
    this.onChangeEdit = this.onChangeEdit.bind(this);    
  }

  onChangeEdit = (e) => {
    var orderer = this.state.editingObj["orderer"];
    var name = this.state.editingObj["name"];
    var count = this.state.editingObj["count"];
    if(e.target.name === "orderer"){
      orderer = e.target.value;
    } else if(e.target.name === "name"){
      name = e.target.value;
    } else if(e.target.name === "count"){
      count = e.target.value;
    }
    else{
      return;
    }

    this.setState(prevState => ({editingObj: {id: prevState.editingObj["id"], orderer, name, count}}));
  }

  refuseEdit = () => {
    this.setState(prevState => ({isEditing: !prevState.isEditing}));
    this.handleClose();
  }

  handleClose = () => {
    this.setState(prevState => ({
      show_modal: !prevState.show_modal,
    }));
}

  onAdd = (e) => {
    var orderer = e.target.elements.orderer.value;
    var name = e.target.elements.name.value;
    var count = Number(e.target.elements.count.value);

    var list = this.state.orderList;
    var theSameOrderer = null;
    if(list !== null){
      theSameOrderer = list.filter(element => element["orderer"] === orderer).length;
    }
   
    if(orderer.split(' ').join('') === "" || name.split(' ').join('') === "" || count <= 0 || theSameOrderer > 0){
      alert("Wrong data!");
    }
    else{
      var newOrder = {id: uuidv4(), orderer, name, count}
      var newList = [...this.state.orderList, newOrder];
      this.setState(() => ({
        orderList: newList
      }));
      this.handleClose();
    }
    e.preventDefault();
   
  }

  onDelete = (e) => {
    console.log(`Deleting... (${e.target.value})`);
    if(window.confirm("Are you sure that you want delete this order?") === false)
    {
      return;
    }
    var newList = this.state.orderList;
    newList.splice(e.target.value,1);  
    this.setState({
      orderList: newList
    });
    
  }

  applyEdit = (e) => {
    e.preventDefault();
    this.refuseEdit();
    var list = this.state.orderList;
    if(this.state.editingObj === list[this.state.editingIndex])
    {
      return;
    }
    else{
      list[this.state.editingIndex] = this.state.editingObj;
      this.setState({orderList: list});
    }
    console.log(this.state.orderList);
  }

  onEdit = (e) => {
    var list = this.state.orderList;

    this.setState({editingObj: list[e.target.value], editingIndex: e.target.value});
    this.setState(prevState => ({isEditing: !prevState.isEditing}));
    this.handleClose();
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
        <h1>Restaurant CRUD</h1>
        <p>Made by <a href="https://www.linkedin.com/in/endl/" className="App-link" target="blank">Podobailo Andriy</a></p>
        <br/>
        <Table 
        show_modal={this.state.show_modal}
        closeModal={this.handleClose}
        items = {this.state.orderList} 
        menu = {this.state.menu}
        onEdit = {this.onEdit}
        onDelete = {this.onDelete}
        onAdd = {this.onAdd}
        isEditing = {this.state.isEditing}
        editingObj = {this.state.editingObj}
        applyEdit = {this.applyEdit}
        refuseEdit = {this.refuseEdit}
        onChangeEdit={this.onChangeEdit}
        />
        </header>
      </div>
    );
  }
}

