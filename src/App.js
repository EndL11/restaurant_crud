import React from 'react';
import './App.css';
import Table from './components/Table/Table';
import Menu from './components/Menu/Menu';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const uuidv4 = require('uuid/v4');

export default class App extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      menu:{"Salad": 3.50, "Sushi": 9.65, "Pizza": 12.30},
      orderList: [],
      show_modal: false,
      isEditing: false,
      editingObj: null,
      editingIndex: null,
      listForms: [{id: uuidv4()}],

      editingDish: null,
      isEditingDish: false,
      editingName: null
    }
    this.onEdit = this.onEdit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.applyEdit = this.applyEdit.bind(this);
    this.onChangeEdit = this.onChangeEdit.bind(this);    
    this.addForm = this.addForm.bind(this);    
    this.deleteForm = this.deleteForm.bind(this);    
    this.cancelEdit = this.cancelEdit.bind(this); 
    this.onAdd = this.onAdd.bind(this);   

    this.addDish = this.addDish.bind(this);   
    this.onChangeDish = this.onChangeDish.bind(this);   
    this.onDeleteDish = this.onDeleteDish.bind(this);   
    this.onEditDish = this.onEditDish.bind(this);   
    this.applyEditDish = this.applyEditDish.bind(this);   
    
    
  }

  deleteEmptyForms = (list) => {
   if(list.length >= 1){
    var formIndex = null;
    var i = 0;
    while(i < list.length){
      if(list[i].count <= 0 || list[i].count === null){
        formIndex = list.findIndex((value) => value.id === list[i].id);
        list.splice(formIndex, 1);
      }
      else {
        i++;
      }
    }
   } 
   else {
      return;
   }
  }

  addFormEdit = () => {
    var editObj = this.state.editingObj;
    editObj["orderArray"].push({
      id: uuidv4(),
      name: Object.keys(this.state.menu)[0],
      count: null 
      });

    this.setState({editingObj: editObj});
  }

  onChangeEdit = (e, id = 0) => {
    var orderer = this.state.editingObj["orderer"];

    var orderArray = this.state.editingObj["orderArray"];

    if(e.target.name === "orderer" && e.target.value.split(" ").join("") !== ""){
      orderer = e.target.value;
    } else if(e.target.name === "name" && e.target.value.split(" ").join("") !== ""){
      orderArray.find((val) => val.id === id).name = e.target.value;
    } else if(e.target.name === "count"){
      orderArray.find((val) => val.id === id).count = e.target.value;
    }
    else{
      alert("Wrong data!");
      return;
    }
    this.setState(prevState => ({editingObj: {id: prevState.editingObj["id"], orderer, orderArray}}));
  }
  
  cancelEdit = () => {
    this.setState(prevState => ({
      isEditing: !prevState.isEditing,
      editingObj: null,
      editingIndex: null
    }));
    this.handleClose();
  }

  handleClose = () => {
    this.setState(prevState => ({
      show_modal: !prevState.show_modal,
      listForms: [{id: uuidv4()}]
    }));
}

  onAdd = (count, names, counts, orderer) => {
    var orderListNew = [];
    
    var filter = this.state.orderList;
    var theSameOrderer = null;
    if(filter !== null){
      theSameOrderer = filter.filter(element => element["orderer"] === orderer.value).length;
    }

    if(orderer.value.split(' ').join('') === "" || theSameOrderer > 0){
      alert("Wrong data!");
      return;
    }

    for(var i = 0; i < count; i++){
      if(names[i].value.split(' ').join('') !== "" && Number(counts[i].value) > 0)
      orderListNew.push({id: uuidv4(), name: names[i].value, count: Number(counts[i].value)});
      else{
        alert("Wrong data!");
        return;
      }
    }

    if(orderListNew.length < 1){
      alert("Wrong data!");
      return;
    }

    var list = this.state.orderList;
    list.push({id: uuidv4(), orderer: orderer.value, orderArray: orderListNew});
    this.setState({orderList: list});
    this.handleClose();
  }

  onDelete = (e) => {
    if(window.confirm("Are you sure that you want delete this order?") === false)
    {
      return;
    }
    var newList = this.state.orderList;
    var index = newList.findIndex(val => val.id === e.target.value);
    newList.splice(index, 1);  
    this.setState({
      orderList: newList,
      listForms : [{id: uuidv4()}]
    });
  }

  applyEdit = (e) => {
    e.preventDefault();
    
    var list = this.state.orderList;
    var orderArray = this.state.editingObj["orderArray"];

    this.deleteEmptyForms(orderArray);
    this.setState({editingObj: {id: this.state.editingObj["id"],
     orderer: this.state.editingObj["orderer"], orderArray}});


    for(var i = 0; i < list.length; i++){
      if(i === this.state.editingIndex)
      continue;

      if(list[i].orderer === this.state.editingObj.orderer){
        alert("Order of this orderer alredy exists!");
        return;
      }
    }


    if(orderArray.length <= 0){
      alert("Wrong data!\nAdd some dishes!");
      return;
    }else{
      if(this.state.editingObj !== list[this.state.editingIndex])
      {
        list[this.state.editingIndex] = this.state.editingObj;
        this.setState({orderList: list});
      }
    }
    this.cancelEdit();
  }

  onEdit = (e) => {
    var list = this.state.orderList;
    var index = list.findIndex(val => val.id === e.target.value);

    // копіювання об'єкту
    var objForEdit = JSON.parse(JSON.stringify(list.find(value => value.id === e.target.value)));
   
    this.setState({editingObj: objForEdit, editingIndex: index});
    this.setState(prevState => ({isEditing: !prevState.isEditing}));
    this.handleClose();
  }

  addForm = () => {
    var obj = {id: uuidv4()};
    this.setState(prevState => ({listForms: prevState.listForms.length > 0 ? [...prevState.listForms, obj] : [obj]}));
  }

  deleteForm = (id, i = false) => {
    if(i === false){
      var list = this.state.listForms;
      var objIndex = list.findIndex(value => value["id"] === id);
      list.splice(objIndex, 1);
      this.setState({listForms: list});
    }else{
      var editOrder = this.state.editingObj;
      const formIndex = editOrder["orderArray"].findIndex(value => value["id"] === id);
      editOrder["orderArray"].splice(formIndex, 1);
      this.setState({editingObj: editOrder});
    }
  }

  /* 
            ********************Меню********************
  */
  cancelEditDish = () => {
    this.setState(prevState => ({isEditingDish: !prevState.isEditingDish}));
    this.setState({editingDish: null});
    this.handleClose();
  }

  addDish = (e) => {
    e.preventDefault();
    var name = e.target.name.value;
    var price = Number(e.target.price.value);
    var menu = this.state.menu;

    if(name.split(" ").join("") === "" || price <= 0){
      alert("Wrong data!");
      return;
    }
    menu[name] = price;
    this.setState({menu});
    this.handleClose();
  }

  onChangeDish = (e) => {
    var editingDish = this.state.editingDish;
    var value = editingDish[Object.keys(editingDish)[0]];
    
    if(e.target.name === "name" && e.target.value.split(" ").join("") !== ""){
      for(var key in editingDish){
        key = e.target.value;
        editingDish[key] = value;
        delete editingDish[Object.keys(editingDish)[0]];
      }
    } 
    else if(e.target.name === "price" && Number(e.target.value) >= 1) {
      value = Number(e.target.value);
      editingDish[Object.keys(editingDish)[0]] = value;
    } 
    else {
      return;
    }

    this.setState({editingDish});

  }

  onEditDish = (e) => {
    this.cancelEditDish();
    var menu = this.state.menu;
    var name = e.target.value;

    var objForEdit = {[name]: menu[name]};
   
    this.setState({editingDish: objForEdit, editingName: Object.keys(objForEdit)[0]});

  }

  onDeleteDish = (e) => {
    if(window.confirm("Are you sure that you want delete this dish?") === false)
    {
      return;
    }
    var newMenu = this.state.menu;
    delete newMenu[e.target.value]
    this.setState({
      menu: newMenu,
    });
  }

  applyEditDish = (e) => {
    e.preventDefault();
    
    var menu = this.state.menu;

    for(var i = 0; i < Object.keys(menu).length; i++){
      if(Object.keys(this.state.editingDish)[0] === this.state.editingName)
      continue;

      if(Object.keys(menu)[i] === Object.keys(this.state.editingDish)[0]){
        alert("Order of this orderer alredy exists!");
        return;
      }
    }

    console.log(this.state.editingName);
    delete menu[this.state.editingName];
    menu[Object.keys(this.state.editingDish)[0]] = this.state.editingDish[Object.keys(this.state.editingDish)[0]];
    this.setState({menu, editingDish: null, editingName: null});
    this.cancelEditDish();
  }

  render(){
    return (
      <Router>
      <div className="App">
        <header className="App-header">
        <ul>
          <li>
          <Link to="/">Home</Link>
          </li>
          <li>
          <Link to="/menu">Menu</Link>
          </li>
        </ul>
        <h1>Restaurant CRUD</h1>
        <p>Made by <a href="https://www.linkedin.com/in/endl/" className="App-link" target="blank">Podobailo Andriy</a></p>
        <br/>
        <Route exact path="/">
        <Table 
        show_modal={this.state.show_modal}
        closeModal={this.handleClose}
        items = {this.state.orderList} 
        menu = {this.state.menu}
        onEdit = {this.onEdit}
        onDelete = {this.onDelete}
        isEditing = {this.state.isEditing}
        editingObj = {this.state.editingObj}
        applyEdit = {this.applyEdit}
        cancelEdit = {this.cancelEdit}
        onChangeEdit={this.onChangeEdit}
        addForm = {this.addForm}
        forms = {this.state.listForms}
        deleteForm = {this.deleteForm}
        onAdd = {this.onAdd}
        addFormEdit = {this.addFormEdit}
        />
        </Route>

        <Route path="/menu">
        <Menu 
        show_modal={this.state.show_modal}
        menu={this.state.menu}
        closeModal={this.handleClose}
        addDish = {this.addDish}
        onChangeDish={this.onChangeDish}
        isEditingDish = {this.state.isEditingDish}
        editingDish = {this.state.editingDish}
        onDeleteDish = {this.onDeleteDish}
        onEditDish = {this.onEditDish}
        applyEditDish = {this.applyEditDish}
        cancelEditDish = {this.cancelEditDish}

        />
        </Route>
        </header>
      </div>
      </Router>
    );
  }
}

