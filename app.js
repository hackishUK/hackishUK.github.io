var vm = new Vue({
  el: '#shopping-list',
  data: {
      quantity: 1,
      itemName: '',
      internalName: '',
      diy: false,
      hex: '',
      codeOutput: '',
      codeOutput2: '',
      errorMessage: '',
      showDropdown: false,
      selectedItems: [],
      itemsList: [],
      inEditMode: false,
      itemCount: 0,
      diyCount: 0,
      trips: 1,
      isSaved: false,
      validItemSelected: false
  },
  computed: {
    filterNamesList () {
      return this.itemsList.filter((item) => {
        return item.itemName.toLowerCase().replace(/-/g, '').replace(/\s/g, '').includes(this.itemName.toLowerCase().replace(/-/g, '').replace(/\s/g, ''));
      }).slice(0,1000);
    }
  },
  methods: {
      addItem: function (){

        if ( this.validItemSelected ) {
          var quantityIN = this.quantity;
          var hexIN = this.hex;
          var diyIN = this.diy;
          var fishbugIN = this.fishbug;
          var colorIN = this.color;
          var itemNameIN = this.itemName.trim();
          var internalNameIN = this.internalName;
          this.errorMessage = '';

          if ( quantityIN <= 512 && quantityIN > 0 ) {
            this.selectedItems.push({
              quantity: quantityIN,
              itemName: itemNameIN,
              hex: hexIN,
              color: colorIN,
              fishbug: fishbugIN,
              diy: diyIN,
              internalName: internalNameIN,
              inEditMode: false
            });
            this.clearAll();
            this.updateOutput();
            console.log(this.selectedItems);
          } else {
            this.errorMessage = 'Check your quantity!';
          }
          this.calculateTotals();
          this.validItemSelected = false;
          this.saveList();
        }

      },
      calculateTotals: function () {
        var itemCountIN = 0;

        this.selectedItems.forEach(function (item, index) {
          itemCountIN += parseInt(item.quantity, 10);
        });
        this.itemCount = itemCountIN;

        this.diyCount = this.selectedItems.filter((item) => item.diy === true).length;
        this.fishbugCount = this.selectedItems.filter((item) => item.fishbug === true).length;
        this.trips = Math.ceil((this.itemCount - this.diyCount)/40);
      },
      clearQuantity: function () {
          this.quantity = 1;
      },
      clearItemName: function () {
          this.itemName = '';
      },
      clearAll: function () {
        this.clearQuantity();
        this.clearItemName();
      },
      removeItem: function (index){
          this.selectedItems.splice(index, 1);
          this.calculateTotals();
          this.updateOutput();
          this.saveList();
      },
      editItem:function (item){
        item.inEditMode = true;
      },
      editItemComplete: function (item) {
        item.inEditMode = false;
        this.calculateTotals();
        this.updateOutput();
        this.saveList();
      },
      updateOutput: function() {
        if (this.selectedItems.length == 0) {
          this.codeOutput2 = 'Add items to your list!';
          return;
        }
        var tempCodeOutput ='';

        for (let i = 0; i < this.selectedItems.length; i++) {

          if ( this.selectedItems[i].quantity > 1 ) {
            for (let j = 0; j < this.selectedItems[i].quantity; j++) {
              tempCodeOutput += this.selectedItems[i].hex;
            }
          } else {
            tempCodeOutput += this.selectedItems[i].hex;
          }

        }
        tempCodeOutput = '`' + tempCodeOutput + '`';
        this.codeOutput = tempCodeOutput;
        this.codeOutput2 = tempCodeOutput;
      },
      populateName: function(item) {
        if (typeof item.color !== 'undefined') {
          this.itemName = item.itemName + ' (' + item.color + ')';
          this.color = item.color;
        } else {
          this.itemName = item.itemName;
        }
        this.diy = item.diy;
        this.fishbug = item.fishbug;
        this.hex = item.hex;
        this.internalName = item.internalName;
        this.showDropdown = false;
        this.validItemSelected = true;
      },
      getdataApi: function() {
        $.getJSON(atob(atob("THk5eVlYY3VaMmwwYUhWaWRYTmxjbU52Ym5SbGJuUXVZMjl0TDJoaFkydHBjMmhWU3k5aFl5MXBkR1Z0Y3k5dFlYTjBaWEl2YVhSbGJYTXRaR1YyTG1wemIyND0")), ( data )=> {
          this.itemsList = data;
        });
      },
      copyToClipboard: function() {
        var codeToCopy = document.querySelector('#codeToCopy');
        codeToCopy.setAttribute('type', 'text');
        codeToCopy.select();

        try {
          var successful = document.execCommand('copy');
          var msg = successful ? 'successfuly' : 'unsuccessful';
          alert('Code was copied ' + msg);
        } catch (err) {
          alert('Oops, unable to copy');
        }

        /* unselect the range */
        codeToCopy.setAttribute('type', 'hidden');
        window.getSelection().removeAllRanges();
      },
      saveList: function() {
        const parsed = JSON.stringify(this.selectedItems);
        localStorage.setItem('selectedItems', parsed);
      }

  },
  mounted: function() {
    this.getdataApi();

    if (localStorage.getItem('selectedItems')) {
      try {
        this.selectedItems = JSON.parse(localStorage.getItem('selectedItems'));
      } catch(e) {
        localStorage.removeItem('selectedItems');
      }
    }
    this.calculateTotals();
    this.updateOutput();
  }
});
