import React, {useState, useEffect} from 'react';
import './App.css';
import Table from './components/Table/Table';
import Menu from './components/Menu/Menu';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

const uuidv4 = require('uuid/v4');

export function Application(){
  const [list, setList] = useState([]);
  const [editingObj, setEditingObj] = useState(null);
  const [menu, setMenu] = useState([
    // {menuId: uuidv4(), name: "Salad", price: 3.50},
    // {menuId: uuidv4(), name: "Sushi", price: 9.65},
    // {menuId: uuidv4(), name: "Pizza", price: 12.30}
]);
  const [show_modal, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [listForms, setFormsList] = useState([{id: uuidv4()}]);

  const [editingDish, setEditingDish] = useState(null);
  const [isEditingDish, setIsEditingDish] = useState(false);
  const [editingDishIndex, setEditingDishIndex] = useState(null);
  const [editingDishName, setEditingDishName] = useState(null);


  useEffect(()=>{
    axios.get('http://localhost:3001/orderList').then(({data}) => {
        if(data !== list)
        setList(data);
    });
  }, [list]);

  useEffect(()=>{
    axios.get('http://localhost:3001/menu').then(({data}) => {
      if(data !== menu)
        setMenu(data);
    });
  }, [menu]);

  const deleteEmptyForms = (list) => {
    if(list.length >= 1){
     let formIndex = null;
     let i = 0;
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
 
  const addFormEdit = () => {
     let editObj = editingObj;
     editObj["orderArray"].push({
       id: uuidv4(),
       name: Object.keys(menu)[0],
       count: null 
       });
     setEditingObj(editObj);
   }

   const onChangeEdit = (e, id = 0) => {
    let orderer = editingObj["orderer"];

    let orderArray = editingObj["orderArray"];

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
    setEditingObj({orderId: editingObj["orderId"], orderer, orderArray, id: editingObj["id"]});

  }
  
  const cancelEdit = () => {
    setEditingIndex(null);
    setIsEditing(!isEditing);
    setEditingObj(null);
    handleClose();
  }

  const handleClose = () => {
    setShow(!show_modal);
    setFormsList([{id: uuidv4()}]);
  }

  const onAdd = (count, names, counts, orderer) => {
    let orderListNew = [];
    
    let filter = list;
    let theSameOrderer = null;
    if(filter !== null){
      theSameOrderer = filter.filter(element => element["orderer"] === orderer.value).length;
    }

    if(orderer.value.split(' ').join('') === "" || theSameOrderer > 0){
      alert("Wrong data!");
      return;
    }

    for(let i = 0; i < count; i++){
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

    filter.push({orderId: uuidv4(), orderer: orderer.value, orderArray: orderListNew});

    axios.post('http://localhost:3001/orderList', {orderId: uuidv4(), orderer: orderer.value, orderArray: orderListNew});

    setList(filter);
    handleClose();
  }

  const onDelete = (e) => {
    if(window.confirm("Are you sure that you want delete this order?") === false)
    {
      return;
    }
    let newList = list;
    let index = newList.findIndex(val => val.orderId === e.target.value);
    let id = newList.find(val => val.orderId === e.target.value).id;
    newList.splice(index, 1);  

    axios.delete('http://localhost:3001/orderList/'+ id + "/").then(({data}) => {console.log(data);});
    setList(newList);
    setFormsList([{id: uuidv4()}]);

  }

  const applyEdit = (e) => {
    e.preventDefault();
    
    let newList = list;
    let orderArray = editingObj["orderArray"];

    deleteEmptyForms(orderArray);

    setEditingObj({orderId: editingObj["orderId"],
    orderer: editingObj["orderer"], orderArray, id: editingObj["id"]});


    for(let i = 0; i < newList.length; i++){
      if(i === editingIndex)
      continue;

      if(newList[i].orderer === editingObj.orderer){
        alert("Order of this orderer alredy exists!");
        return;
      }
    }

    if(orderArray.length <= 0){
      alert("Wrong data!\nAdd some dishes!");
      return;
    }else{
      if(editingObj !== newList[editingIndex])
      {
        newList[editingIndex] = editingObj;
        setList(newList);
        console.log(newList[editingIndex]);
        axios.put('http://localhost:3001/orderList/' + editingObj.id + "/", editingObj);
      }
    }
    cancelEdit();
  }

  const onEdit = (e) => {
    let newList = list;
    let index = newList.findIndex(val => val.orderId === e.target.value);

    // копіювання об'єкту
    let objForEdit = JSON.parse(JSON.stringify(newList.find(value => value.orderId === e.target.value)));
   
    setEditingObj(objForEdit);
    setEditingIndex(index);
    setIsEditing(!isEditing);

    handleClose();
  }

  const addForm = () => {
    let obj = {id: uuidv4()};
    if(listForms.length > 0){
      setFormsList([...listForms, obj]);
    }
    else {
      setFormsList([obj]);
    }
  }

  const deleteForm = (id, i = false) => {
    if(i === false){
      let list = listForms;
      let objIndex = list.findIndex(value => value["id"] === id);
      list.splice(objIndex, 1);
      setFormsList(list);
    }else{
      let editOrder = editingObj;
      const formIndex = editOrder["orderArray"].findIndex(value => value["id"] === id);
      editOrder["orderArray"].splice(formIndex, 1);
      setEditingObj(editOrder);
    }
  }

  /* 
            ********************Меню********************
  */
 const cancelEditDish = () => {
   setIsEditingDish(!isEditingDish);
   setEditingDishIndex(null);
   setEditingDish(null);
   handleClose();
  }

  const addDish = (e) => {
    e.preventDefault();
    let name = e.target.name.value;
    let price = Number(e.target.price.value);
    let newMenu = menu;

    if(name.split(" ").join("") === "" || price <= 0 || isNaN(price) === true){
      alert("Wrong data!");
      return;
    }

    let newDish = {menuId: uuidv4(), name, price};


    axios.post('http://localhost:3001/menu', newDish);

    setMenu([...newMenu, newDish]);
    handleClose();
  }

  const onChangeDish = (e) => {
    let newEditingDish = editingDish;
    
    if(e.target.name === "name" && e.target.value.split(" ").join("") !== ""){
      newEditingDish.name = e.target.value;
    } 
    else if(e.target.name === "price" && Number(e.target.value) > 0) {
      newEditingDish.price = Number(e.target.value.replace(",", "."));
    } 
    else {
      return;
    }

    setEditingDish(newEditingDish);

  }

  const onEditDish = (e) => {
    cancelEditDish();
    let newMenu = menu;
    let menuId = e.target.value;

    let index = newMenu.findIndex(el => el.menuId === menuId);

    let objForEdit = JSON.parse(JSON.stringify(newMenu[index]));
   
    setEditingDish(objForEdit);
    setEditingDishIndex(index);
    setEditingDishName(objForEdit.name);
  }

  const onDeleteDish = (e) => {
    if(window.confirm("Are you sure that you want delete this dish?") === false)
    {
      return;
    }
    let menuId = e.target.value;
    let newMenu = menu;
    let deletingOBj = newMenu.find(el => el.menuId === menuId);
    let index = newMenu.findIndex(el => el.menuId === menuId);
    axios.delete('http://localhost:3001/menu/' + deletingOBj.id + '/');
    newMenu.splice(index, 1);
    newMenu = JSON.parse(JSON.stringify(newMenu));
    setMenu(newMenu);
  }

  const applyEditDish = (e) => {
    e.preventDefault();
    
    let newMenu = menu;

    for(let i = 0; i < newMenu.length; i++){
      if(editingDish.name === editingDishName)
      continue;
      

      if(newMenu[i].name === editingDish.name){
        alert("Order of this orderer alredy exists!");
        return;
      }
    }

    newMenu[editingDishIndex] = editingDish;

    // оновлення списку замовлень відповідно до зміни назви страви
    let newList = list;
    for(let i = 0; i < newList.length; i++){
      newList[i]["orderArray"].forEach(item => {
        if(item.name === editingDishName){
          item.name = editingDish.name;
          axios.put('http://localhost:3001/orderList/' + newList[i].id + "/", newList[i]);
        }
      });
    }
      

    setList(newList);
    axios.put('http://localhost:3001/menu/' + editingDish.id + "/", editingDish);

    setMenu(newMenu);
    setEditingDish(null);
    setEditingDishName(null);
    cancelEditDish();
  }

  return(
    <Router>
      <div className="App">
        <header className="App-header">
        <ul className="nav navbar navnav">
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
        show_modal={show_modal}
        closeModal={handleClose}
        items = {list} 
        menu = {menu}
        onEdit = {onEdit}
        onDelete = {onDelete}
        isEditing = {isEditing}
        editingObj = {editingObj}
        applyEdit = {applyEdit}
        cancelEdit = {cancelEdit}
        onChangeEdit={onChangeEdit}
        addForm = {addForm}
        forms = {listForms}
        deleteForm = {deleteForm}
        onAdd = {onAdd}
        addFormEdit = {addFormEdit}
        />
        </Route>

        <Route path="/menu">
        <Menu 
        show_modal={show_modal}
        menu={menu}
        closeModal={handleClose}
        addDish = {addDish}
        onChangeDish={onChangeDish}
        isEditingDish = {isEditingDish}
        editingDish = {editingDish}
        onDeleteDish = {onDeleteDish}
        onEditDish = {onEditDish}
        applyEditDish = {applyEditDish}
        cancelEditDish = {cancelEditDish}
        />
        </Route>
        </header>
      </div>
    </Router>
  );
}

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
    let formIndex = null;
    let i = 0;
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
    let editObj = this.state.editingObj;
    editObj["orderArray"].push({
      id: uuidv4(),
      name: Object.keys(this.state.menu)[0],
      count: null 
      });

    this.setState({editingObj: editObj});
  }

  onChangeEdit = (e, id = 0) => {
    let orderer = this.state.editingObj["orderer"];

    let orderArray = this.state.editingObj["orderArray"];

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
    let orderListNew = [];
    
    let filter = this.state.orderList;
    let theSameOrderer = null;
    if(filter !== null){
      theSameOrderer = filter.filter(element => element["orderer"] === orderer.value).length;
    }

    if(orderer.value.split(' ').join('') === "" || theSameOrderer > 0){
      alert("Wrong data!");
      return;
    }

    for(let i = 0; i < count; i++){
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

    let list = this.state.orderList;
    list.push({id: uuidv4(), orderer: orderer.value, orderArray: orderListNew});
    this.setState({orderList: list});
    this.handleClose();
  }

  onDelete = (e) => {
    if(window.confirm("Are you sure that you want delete this order?") === false)
    {
      return;
    }
    let newList = this.state.orderList;
    let index = newList.findIndex(val => val.id === e.target.value);
    newList.splice(index, 1);  
    this.setState({
      orderList: newList,
      listForms : [{id: uuidv4()}]
    });
  }

  applyEdit = (e) => {
    e.preventDefault();
    
    let list = this.state.orderList;
    let orderArray = this.state.editingObj["orderArray"];

    this.deleteEmptyForms(orderArray);
    this.setState({editingObj: {id: this.state.editingObj["id"],
     orderer: this.state.editingObj["orderer"], orderArray}});


    for(let i = 0; i < list.length; i++){
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
    let list = this.state.orderList;
    let index = list.findIndex(val => val.id === e.target.value);

    // копіювання об'єкту
    let objForEdit = JSON.parse(JSON.stringify(list.find(value => value.id === e.target.value)));
   
    this.setState({editingObj: objForEdit, editingIndex: index});
    this.setState(prevState => ({isEditing: !prevState.isEditing}));
    this.handleClose();
  }

  addForm = () => {
    let obj = {id: uuidv4()};
    this.setState(prevState => ({listForms: prevState.listForms.length > 0 ? [...prevState.listForms, obj] : [obj]}));
  }

  deleteForm = (id, i = false) => {
    if(i === false){
      let list = this.state.listForms;
      let objIndex = list.findIndex(value => value["id"] === id);
      list.splice(objIndex, 1);
      this.setState({listForms: list});
    }else{
      let editOrder = this.state.editingObj;
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
    let name = e.target.name.value;
    let price = Number(e.target.price.value);
    let menu = this.state.menu;

    if(name.split(" ").join("") === "" || price <= 0){
      alert("Wrong data!");
      return;
    }
    menu[name] = price;
    this.setState({menu});
    this.handleClose();
  }

  onChangeDish = (e) => {
    let editingDish = this.state.editingDish;
    let value = editingDish[Object.keys(editingDish)[0]];
    
    if(e.target.name === "name" && e.target.value.split(" ").join("") !== ""){
      for(let key in editingDish){
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
    let menu = this.state.menu;
    let name = e.target.value;

    let objForEdit = {[name]: menu[name]};
   
    this.setState({editingDish: objForEdit, editingName: Object.keys(objForEdit)[0]});

  }

  onDeleteDish = (e) => {
    if(window.confirm("Are you sure that you want delete this dish?") === false)
    {
      return;
    }
    let newMenu = this.state.menu;
    delete newMenu[e.target.value]
    this.setState({
      menu: newMenu,
    });
  }

  applyEditDish = (e) => {
    e.preventDefault();
    
    let menu = this.state.menu;

    for(let i = 0; i < Object.keys(menu).length; i++){
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

