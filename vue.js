


const ItemComponent = {
  props:['id', 'title', 'img', 'price'],
  template:`<div   class="goods-item">
          <img :src="img">
          <h3>{{title}}</h3>
          <p class='price'>{{price}} </p>&#8381; 
          <button  class="btn" @click="handelBuyClick(id)">Добавить</button>
          </div>`,
  methods: {
    handelBuyClick(id) {
      this.$emit('buy', id);
    }
  },
  
};


const ItemsListComponent = {
  props: ['items'],
  template: `<div >
            <h2>Католог товара</h2>
            <div class="goods-list">
            <item-component 
              v-if="items.length"
              v-for="item in items"
              :key="item.id" 
              :id="item.id" 
              :title="item.title" 
              :img="item.img" 
              :price="item.price"
              @buy="handelBuyClick(item)"
              
            ></item-component>
            </div>
            <div v-if="!items.length" >Товар не найден </div>
            </div>`,
  methods: {
    handelBuyClick(item) {
      this.$emit('buy', item);
    }
  },
  components: {
    'item-component': ItemComponent,
   
  },
};

const BasketsListComponent = {
  props:[ 'id', 'title', 'qty'],
  template: `<li  class="list" >
              <h3>{{title}}</h3>
              <input class="qty" type="number" :value="qty" @input="handelQuantityChange">
              <button @click="handelDeletClick"> x </button>
            </li>`,
  

  methods:{
    handelQuantityChange(event) {
      this.$emit('changed', {id:this.id, qty: event.target.value});

    },
    handelDeletClick() {
      this.$emit('deleted', this.id);
    }
  }

  

};

const BasketComponent = {
  props: ['items'],
  template: `<div class="btn-menu ">
            <ul>
             <baskets-list-component
             v-for="item in items"
             :key="item.id"
             :title="item.title" 
             :id="item.id"
             :qty="item.qty"
             @changed="handelQuantityChange"
             @deleted="handelDelet"
             ></baskets-list-component>
             </ul>
             <p>Сумма заказа</p>
             <div class="total"> {{total}} </div>
             </div>
             `,
  computed: {
    total(){
      return this.items.reduce((acc, item) => acc + item.qty * item.price, 0 );
    },
  },
   
        
   

  components: {
    'baskets-list-component': BasketsListComponent,
  },

  methods:{
    handelQuantityChange(item) {
      this.$emit('changed', item);
    },
    handelDelet(id) {
      this.$emit('deleted', id);
    }
  }
};




const SearchComponent = {
  template: `
    <div>
      <input type="text" v-model="query" >
      <button @click="handelSearchClick"> Поиск </button>
    </div>
  `,
  data() {
    return{
      query: '',
    }
  },

  methods: {
    handelSearchClick() {
      this.$emit('search', this.query);
    }
  }
}


const app = new Vue({

  el: '#root',
  data: {
    items: [],
     
    basket: [],
    menus: [],
    query: '',
    isBasketVisible: false,
     
   
  },
  methods: {
     
     
    handelBuyClick(item){
      const basketItem = this.basket.find((basketItem) => +basketItem.id === +item.id); 
      
      if(basketItem) {
        fetch(`/baskets/${item.id}`, {
          method: 'PATCH',
          body: JSON.stringify({qty: basketItem.qty + 1}),
          headers: {
            'Content-type': 'application/json',
          }
        }).then(() => {
          basketItem.qty++;
          
        });
      } else {
        fetch('/baskets', {
        method: 'POST',
        body: JSON.stringify({...item, qty: 1}),
        headers: {
          'Content-type': 'application/json',
        },
      }).then(() => {
        this.basket.push({...item, qty:1});
      });
      }
      
      
      
    },
    handelDeletClick(id) {
      const basketItem = this.basket.find((basketItem) => +basketItem.id === +id); 

      if(basketItem && basketItem.qty > 1) {
        fetch(`/baskets/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({qty: basketItem.qty - 1}),
          headers: {
            'Content-type': 'application/json',
          }
        }).then(() => {
          basketItem.qty--;
          
        });
      } else {
          if(confirm('Вы действительно хотите удалить товар из корзины?')) {
            fetch(`/baskets/${id}`, {
            method: 'DELETE',
          }).then(() => {
            this.basket = this.basket.filter((item) => item.id !== id);
          });
          }
        
      }
      
    },
    toggleBasket() {
      this.isBasketVisible = !this.isBasketVisible;
    },
    onQueryChange(query){
      this.query = query;
    },
    handelBasketChange(item) {
      const basketItem = this.basket.find((basketItem) => +basketItem.id === +item.id); 
      basketItem.qty = item.qty;
      fetch(`/baskets/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({qty: item.qty }),
        headers: {
          'Content-type': 'application/json',
        }
      });
    }
  },
  mounted() {
    fetch('/goods')
      .then(response => response.json())
      .then((goods) => {
          this.items = goods;
        
      });
    
    fetch('/baskets')
      .then(response => response.json())
      .then((baskets) => {
          this.baskets = baskets;
           
      });
    // fetch('/menus')
    //   .then(response => response.json())
    //   .then((menus) => {
    //       this.menus = menus;
          
    //   });
  },

  computed: {
   
    filteredItems() {
      return this.items.filter((item) => {
        const regexp = new RegExp(this.query, 'i');
        return regexp.test(item.title);
        });
    }
  },

  components: {
    'items-list-component': ItemsListComponent,
    'item-component': ItemComponent,
    'baskets-list-component': BasketsListComponent,
    'basket-component': BasketComponent,
    'search-component': SearchComponent,
  },
}); 


