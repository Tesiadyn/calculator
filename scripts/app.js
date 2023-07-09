let model = (function () {

  let items = function(id, name, value){

    this.id = id;
    this.name = name;
    this.value = value;


  };

  // allItems = [];
  // totals = 0;

   let data = {

    allItems: [],
    totals: 0,

  };

    let calculateTotal = function(){

      let sum = 0;
      data.allItems.forEach(function(currentVal){

        sum += currentVal.value;

      });

      data.totals = sum;

    };


  return{

    addItem: function(name, value){

      let ID;

      if(data.allItems.length > 0){

        ID = data.allItems[data.allItems.length - 1].id + 1;
        // 新ID為最後一個元素的 ID+1
      } else {

        ID = 0;

      }

      
      let newItem = new items(ID, name, value);
      data.allItems.push(newItem);

      return newItem;

    },

    deleteItem: function(id){
      // 接收controller傳過來的ID

      let ids = data.allItems.map(function(currentVal){

        return currentVal.id;

      });
      // 新的ID的array

      let index = ids.indexOf(parseInt(id, 10));
      // 查詢新的id的具體位子 把id這一個string轉成10進位整數

      if(index >= 0){

        data.allItems.splice(index, 1);
        // 把某個元素從array裡面移除
        // 從index刪除1個元素

      };
     
    },

    calculateSum: function(){

      calculateTotal();

      return{

        sum: data.totals,
      }

    },

    test: function(){
      console.log(data);
    }

  }

})();

let view = (function () {
  let DOMstrings = {
    name: ".name",
    value: ".value",
    btn: ".bought_btn",
    list: ".bought_list",
    sumLabel: ".total_value",
    container: ".container",
    month: ".month",
  };

  let formatting = function(number){

    number = number.toFixed(2);
    number = number.replace(/(\d)(?=(\d{3})+\.)/g,'$1,');

    return number;


  }


  return {

    getInfo: function () {
      return {
        name: document.querySelector(DOMstrings.name).value,
        value: parseFloat(document.querySelector(DOMstrings.value).value),
      };
    },

    addListItem: function(object){

      let newHTML;

      let element = DOMstrings.list;

      let html = '<div class="item clearfix" id="%id%"><div class="item_name">%name%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="delete"><button class="delete_btn"><i class="ion-ios-close-outline"></i></button></div></div>';

      newHTML = html.replace('%id%', object.id);
      newHTML = newHTML.replace('%name%', object.name);
      newHTML = newHTML.replace('%value%', formatting(object.value) + '元');
      
      document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

    },

    deleteListItem: function(id){

      let element = document.getElementById(id);
      element.parentNode.removeChild(element);

    },

    clearInput: function(){

      

      let inputs = document.querySelectorAll(DOMstrings.name + ',' + DOMstrings.value);
      //  會得到一個list
      
      let inputArray = Array.prototype.slice.call(inputs);
      // 把list轉換成array

      inputArray.forEach(function(currentVal){

        currentVal.value = "";

      });

      inputArray[0].focus();
      
    },
    
    displaySum: function(object){

      document.querySelector(DOMstrings.sumLabel).textContent = formatting(object.sum) + '元';
        
    },

    displayMonth: function(){

      let now = new Date();

      let month = now.getMonth();

      let year = now.getFullYear();

      document.querySelector(DOMstrings.month).textContent = year + '年' + month + '月';
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

let controller = (function (m, v) {

  let setupEventListener = function () {

    let DOMstrings = view.getDOMstrings();
 
    document.querySelector(DOMstrings.btn).addEventListener("click", addItem);

    document.addEventListener("keypress", function (event) {
      if (event.keycode === 13) {
        addItem();
      }
    });


    document.querySelector(DOMstrings.container).addEventListener('click', deleteItem);
  };

  let deleteItem = function(event){

    let itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    // console.log(itemID);
    model.deleteItem(itemID);

    view.deleteListItem(itemID);

    updateTotal();
  };



  let updateTotal = function(){

    let sum = model.calculateSum();
    // console.log(sum);
    view.displaySum(sum);
  };

  let addItem = function () {

      let input = view.getInfo();

      if(input.name !== '' && !isNaN(input.value) && input.value > 0){

        let newItem = model.addItem(input.name, input.value);

        view.addListItem(newItem);
        // console.log(newItem);
        view.clearInput();

        updateTotal();
      }
      
     
    };

    return{

      init: function(){

        console.log('APP started.');
        view.displayMonth();
        view.displaySum({sum: 0,});
        setupEventListener();

      }

    }
})(model, view);

controller.init();