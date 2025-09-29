<template>
  <div class="p-6 space-y-8">
    <!-- CREATE ORDER FORM -->
    <div class=" rounded-xl  p-6">
      <h2 class="text-xl font-bold text-navy-blue mb-4">Create Order</h2>
      <form @submit.prevent="createOrderHandler">
        <!-- User Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input v-model="form.userPhone" placeholder="User Phone" class="input" />
          <input v-model="form.userName" placeholder="User Name" class="input" />
        </div>

        <!-- Notes -->
        <textarea v-model="form.notes" placeholder="Order Notes" class="input mb-4"></textarea>

        <!-- Items -->
        <div class="mb-4">
          <h3 class="font-semibold text-navy-blue mb-2">Items</h3>
          <div
            v-for="(item, idx) in form.items"
            :key="idx"
            class="border border-charcoal rounded-lg p-4 mb-2 bg-bone-white relative"
          >
       <button
      type="button"
      @click="removeItem(idx)"
      class="absolute -top-4 right-2 text-charcoal hover:bg-bone-white hover:text-golden-brown flex items-center justify-center transition-colors cursor-pointer bg-red-700 text-white p-3 h-6 w-6 rounded-full"
      title="Remove item"
    >
      <font-awesome-icon icon="trash" />
    </button>

            <input v-model="item.serviceCode" placeholder="Service Code" class="input mb-2" />
            <input v-model="item.serviceName" placeholder="Service Name" class="input mb-2" />
            <div class="flex gap-2">
              <input v-model.number="item.quantity" type="number" placeholder="Qty" class="input flex-1" />
              <input v-model="item.unit" placeholder="Unit" class="input flex-1" />
              <input v-model.number="item.price" type="number" placeholder="Price" class="input flex-1" />
            </div>
            <textarea v-model="item.itemNotes" placeholder="Item Notes" class="input mt-2"></textarea>
          </div>

          <button
            type="button"
            @click="addItem"
            class="px-4 py-2 rounded-md text-white cursor-pointer"
            style="background-color: var(--color-golden-brown)"
          >
            + Add Item
          </button>
        </div>

        <!-- Pickup & Delivery -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 class="font-semibold text-navy-blue mb-2">Pickup</h3>
            <input v-model="form.pickup.date" type="datetime-local" class="input mb-2" />
            <input v-model="form.pickup.window" placeholder="Time Window" class="input mb-2" />
            <input v-model="form.pickup.address.line1" placeholder="Address Line 1" class="input mb-2" />
            <input v-model="form.pickup.address.city" placeholder="City" class="input mb-2" />
          </div>

          <div>
            <h3 class="font-semibold text-navy-blue mb-2">Delivery</h3>
            <input v-model="form.delivery.date" type="datetime-local" class="input mb-2" />
            <input v-model="form.delivery.window" placeholder="Time Window" class="input mb-2" />
            <input v-model="form.delivery.address.line1" placeholder="Address Line 1" class="input mb-2" />
            <input v-model="form.delivery.address.city" placeholder="City" class="input mb-2" />
          </div>
        </div>

        <!-- Pricing Model & Tier -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <select v-model="form.pricingModel" class="input">
            <option disabled value="">Select Pricing Model</option>
            <option value="RETAIL">RETAIL</option>
            <option value="SUBSCRIPTION">SUBSCRIPTION</option>
          </select>

          <select v-model="form.serviceTier" class="input">
            <option disabled value="">Select Service Tier</option>
            <option value="STANDARD">STANDARD</option>
            <option value="PREMIUM">PREMIUM</option>
            <option value="SIGNATURE">SIGNATURE</option>
          </select>
        </div>

        <button
          type="submit"
          class="px-6 py-2 rounded-md text-white cursor-pointer"
          style="background-color: var(--color-pure-gold); color: var(--color-navy-blue)"
        >
          Submit Order
        </button>
      </form>
    </div>

    <!-- LIST USER ORDERS -->
    <div class="bg-bone-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-bold text-navy-blue mb-4">User Orders</h2>
      <div class="flex gap-2 mb-4">
        <input
          v-model="userPhone"
          placeholder="Enter user phone"
          class="input flex-1"
        />
        <button
          @click="fetchOrders"
          class="px-4 py-2 rounded-md text-white cursor-pointer"
          style="background-color: var(--color-golden-brown)"
        >
          Fetch Orders
        </button>
      </div>

      <div v-if="orders.length">
        <div
          v-for="order in orders"
          :key="order._id"
          class="border border-charcoal rounded-lg p-4 mb-4 bg-bone-white"
        >
          <div class="font-semibold text-navy-blue">Order ID: {{ order._id }}</div>
          <div>Status: <span class="font-medium">{{ order.status }}</span></div>
          <div>Grand Total: ₦{{ order.totals.grandTotal }}</div>
          <div>Pickup: {{ formatDate(order.pickup.date) }} ({{ order.pickup.window }})</div>
          <div>Delivery: {{ formatDate(order.delivery.date) }} ({{ order.delivery.window }})</div>

          <ul class="mt-2">
            <li
              v-for="(it, i) in order.items"
              :key="i"
              class="text-sm border-b py-1 text-charcoal"
            >
              {{ it.quantity }} x {{ it.serviceName }} @ ₦{{ it.price }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="text-charcoal">No orders loaded yet.</div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { createOrder, getUserOrders } from '@/services/api.js';
import { useToast } from '@/composables/useToast';

const { showSuccess, showError } = useToast();

const form = ref({
  userPhone: '',
  userName: '',
  notes: '',
  items: [
    {
      serviceCode: '',
      serviceName: '',
      quantity: 1,
      unit: '',
      itemNotes: '',
      addOns: [],
      price: 0,
      express: false,
      sameDay: false,
    },
  ],
  pickup: {
    date: '',
    window: '',
    address: { line1: '', city: '' },
  },
  delivery: {
    date: '',
    window: '',
    address: { line1: '', city: '' },
  },
  pricingModel: '',
  serviceTier: '',
});

const userPhone = ref('');
const orders = ref([]);

function addItem() {
  form.value.items.push({
    serviceCode: '',
    serviceName: '',
    quantity: 1,
    unit: '',
    itemNotes: '',
    addOns: [],
    price: 0,
    express: false,
    sameDay: false,
  });
}

function removeItem(index) {
  form.value.items.splice(index, 1);
}

async function createOrderHandler() {
  try {
    await createOrder(form.value);
    showSuccess('Order created successfully!');
  } catch (err) {
    console.error(err);
    showError(err.message || 'Failed to create order');
  }
}

async function fetchOrders() {
  try {
    const data = await getUserOrders(userPhone.value);
    orders.value = data;
    showSuccess('Orders fetched successfully!');
  } catch (err) {
    console.error(err);
    showError(err.message || 'Failed to fetch orders');
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}
</script>



<style scoped>
.input {
  width: 100%;
  border: 1px solid var(--color-charcoal);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: box-shadow 0.2s;
  background-color: var(--color-bone-white);
  color: var(--color-charcoal);
}
.input:focus {
  box-shadow: 0 0 0 2px var(--color-pure-gold);
  border-color: var(--color-pure-gold);
}
.text-navy-blue {
  color: var(--color-navy-blue);
}
.bg-bone-white {
  background-color: var(--color-bone-white);
}
.bg-bone-white {
  background-color: var(--color-bone-white);
}
.border-charcoal {
  border-color: var(--color-charcoal);
}
</style>

