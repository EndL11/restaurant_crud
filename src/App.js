import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

import './App.css';
import Table from './components/Table/Table';
import Menu from './components/Menu/Menu';

const uuidv4 = require('uuid/v4');                                // функція для генерації унікального id

export function Application(){
  const [list, setList] = useState([]);                           // список замовлень
  const [editingObj, setEditingObj] = useState(null);             // об єкт обраний для редагування 
  const [menu, setMenu] = useState([]);                           // меню
  const [show_modal, setShow] = useState(false);                  // показувати модальне вікно
  const [isEditing, setIsEditing] = useState(false);              // чи редагується об єкт
  const [editingIndex, setEditingIndex] = useState(null);         // індект об єкта, що редагується
  const [listForms, setFormsList] = useState([{id: uuidv4()}]);   // масив із "формами" для множинного замовлення страв

  const [editingDish, setEditingDish] = useState(null);           // об єкт обраний для редагування (страва)
  const [isEditingDish, setIsEditingDish] = useState(false);      // чи редагується об єкт
  const [editingDishIndex, setEditingDishIndex] = useState(null); // індекс об єкта, що редагується

  // перше оновлення даних замовлень із сервера
  useEffect(()=>{
    axios.get('http://localhost:3001/orderList').then(({data}) => {
         setList(data);
    });
  }, []);

  // перше оновлення даних меню із сервера
  useEffect(()=>{
    axios.get('http://localhost:3001/menu').then(({data}) => {
         setMenu(data);
    });
  }, []);

  // очищення порожніх "форм"
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
   
  // додавання "форм" при редагування об єкта 
  const addFormEdit = () => {
     let editObj = editingObj;
     editObj["orderArray"].push({
       id: uuidv4(),
       name: Object.keys(menu)[0],
       count: null 
       });
     setEditingObj(editObj);
   }

   // контроль полів вводу при редагуванні
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

  // відміна редагування
  const cancelEdit = () => {
    setEditingIndex(null);
    setIsEditing(!isEditing);
    setEditingObj(null);
    handleClose();
  }

  // закриття вікна
  const handleClose = () => {
    setShow(!show_modal);
    setFormsList([{id: uuidv4()}]);
  }

  // додавання нового замовлення
  const onAdd = (count, names, counts, orderer) => {
    let orderListNew = [];
    
    let filter = list;

    //перевірка на існуючого замовника
    let theSameOrderer = null;
    if(filter !== null){
      theSameOrderer = filter.filter(element => element["orderer"] === orderer.value).length;
    }
    if(orderer.value.split(' ').join('') === "" || theSameOrderer > 0){
      alert("Wrong data!");
      return;
    }

    // створення списку із стравами та їх кількістю за умови вірності данних
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

    let newObj = {orderId: uuidv4(), orderer: orderer.value, orderArray: orderListNew};
    filter.push(newObj);

    // відправлення та оновлення даних із серверної частини
    axios.post('http://localhost:3001/orderList', newObj).finally(() => {
      axios.get('http://localhost:3001/orderList').then(({data}) => {
        setList(data);
      });
    });

    setList(filter);
    handleClose();
  }

  // видалення замовлення по id
  const onDelete = (e) => {
    if(window.confirm("Are you sure that you want delete this order?") === false)
    {
      return;
    }
    let newList = list;
    let index = newList.findIndex(val => val.orderId === e.target.value);
    let id = newList.find(val => val.orderId === e.target.value).id;
    newList.splice(index, 1);  

    axios.delete('http://localhost:3001/orderList/'+ id + "/");
    setList(newList);
    setFormsList([{id: uuidv4()}]);

  }

  // підтвердження редагування об єкта та збереження змін
  const applyEdit = (e) => {
    e.preventDefault();
    
    let newList = list;
    let orderArray = editingObj["orderArray"];

    // видалення пустих "форм"
    deleteEmptyForms(orderArray);

    setEditingObj({orderId: editingObj["orderId"],
    orderer: editingObj["orderer"], orderArray, id: editingObj["id"]});


    for(let i = 0; i < newList.length; i++){
      if(i === editingIndex)
      continue;

      if(newList[i].orderer === editingObj.orderer){
        alert("Order of this orderer already exists!");
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
        axios.put('http://localhost:3001/orderList/' + editingObj.id + "/", editingObj);
      }
    }
    cancelEdit();
  }

  // визначення об єкта для редагування
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

  // додавання "форм" при додаванні замовлення
  const addForm = () => {
    let obj = {id: uuidv4()};
    if(listForms.length > 0){
      setFormsList([...listForms, obj]);
    }
    else {
      setFormsList([obj]);
    }
  }

  // видалення "форм" (при редагування та додаванні) замовлення
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

  // відміна редагування страви
  const cancelEditDish = () => {
   setIsEditingDish(!isEditingDish);
   setEditingDishIndex(null);
   setEditingDish(null);
   handleClose();
  }

  // додавання страви
  const addDish = (e) => {
    e.preventDefault();
    let name = e.target.name.value;
    let price = Number(e.target.price.value);
    let newMenu = menu;

    if(name.split(" ").join("") === "" || price <= 0 || isNaN(price) === true){
      alert("Wrong data!");
      return;
    }

    // перевірка на схожість страви
    let theSameDish = null;
    if(newMenu !== null){
      theSameDish = newMenu.filter(element => element.name === name).length;
    }

    if(theSameDish > 0){
      alert("Wrong data! Dish is exists!");
      return;
    }


    let newDish = {menuId: uuidv4(), name, price};

    // додавання страви та оновлення даних на серверній частині
    axios.post('http://localhost:3001/menu', newDish).finally(() => {
      axios.get('http://localhost:3001/menu').then(({data}) => {
        setMenu(data);
      });
    });
    setMenu([...newMenu, newDish]);
    handleClose();
  }

  // контроль полів вводу даних при релдагуванні
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

  // визначення об єкта для редагування
  const onEditDish = (e) => {
    cancelEditDish();
    let newMenu = menu;
    let menuId = e.target.value;

    let index = newMenu.findIndex(el => el.menuId === menuId);

    let objForEdit = JSON.parse(JSON.stringify(newMenu[index]));
   
    setEditingDish(objForEdit);
    setEditingDishIndex(index);
  }

  // видалення страви
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

  // підтвердження редагування та застосування змін 
  const applyEditDish = (e) => {
    e.preventDefault();
    let newMenu = menu;
    for(let i = 0; i < newMenu.length; i++){
      if(editingDish.name === newMenu[editingDishIndex].name)
      continue;
      
      if(newMenu[i].name === editingDish.name){
        alert("Dish with this name already exists!");
        return;
      }
    }

    // оновлення списку замовлень відповідно до зміни назви страви
    let newList = list;
    for(let i = 0; i < newList.length; i++){
      newList[i]["orderArray"].forEach(item => {
        if(item.name === newMenu[editingDishIndex].name){
          item.name = editingDish.name;
          axios.put('http://localhost:3001/orderList/' + newList[i].id + "/", newList[i]);
        }
      });
    }
    newMenu[editingDishIndex] = editingDish;  
    setList(newList);
    axios.put('http://localhost:3001/menu/' + editingDish.id + "/", editingDish).finally(() => {
      axios.get('http://localhost:3001/menu').then(({data}) => {
        setMenu(data);
      });
    });
    setMenu(newMenu);
    setEditingDish(null);
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
