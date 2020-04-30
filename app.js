var vm = new Vue({
  el: '#shopping-list',
  data: {
      quantity: 1,
      itemName: '',
      internalName: '',
      diy: false,
      hex: '',
      codeOutput: '',
      errorMessage: '',
      showDropdown: false,
      selectedItems: [],
      itemsList: [],
      inEditMode: false,
      itemCount: 0,
      diyCount: 0,
      trips: 1
  },
  computed: {
    filterNamesList () {
      return this.itemsList.filter((item) => {
        return item.itemName.toLowerCase().replace(/-/g, '').replace(/\s/g, '').includes(this.itemName.toLowerCase().replace(/-/g, '').replace(/\s/g, ''));
      }).slice(0,100);
    }
  },
  methods: {
      addItem: function (){
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
      },
      calculateTotals: function () {
        var itemCountIN = 0;

        this.selectedItems.forEach(function (item, index) {
          itemCountIN += parseInt(item.quantity, 10);
        });
        this.itemCount = itemCountIN;

        this.diyCount = this.selectedItems.filter((item) => item.diy === true).length;
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
      },
      editItem:function (item){
        item.inEditMode = true;
      },
      editItemComplete: function (item) {
        item.inEditMode = false;
        this.calculateTotals();
        this.updateOutput();
      },
      updateOutput: function() {
        if (this.selectedItems.length == 0) {
          this.codeOutput = 'Add items to your list!';
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
      },
      populateName: function(item) {
        if (typeof item.color !== 'undefined') {
          this.itemName = item.itemName + ' (' + item.color + ')';
          this.color = item.color;
        } else {
          this.itemName = item.itemName;
        }
        this.diy = item.diy;
        this.hex = item.hex;
        this.internalName = item.internalName;
        this.showDropdown = false;
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

  },
  mounted: function() {
    this.getdataApi();
    this.updateOutput();
    console.log('mounted');
  }
});
