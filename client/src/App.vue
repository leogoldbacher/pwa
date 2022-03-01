<template>
  <div
    id="app"
    class="
      container
      d-flex
      flex-column
      justify-content-center
      align-items-center
      mt-5
    "
  >
    <button class="btn btn-outline-success" @click="subscribe">
      Subscribe!!!!!
    </button>
    <h3>Hier könnte ihre Werbung stehen!</h3>
    <img :src="`./employees.jpg`" class="mx-auto d-block bild" /><img />
    <ButtonGet @get="fetchData"></ButtonGet>
    <div class="alert alert-danger" role="alert" v-if="this.offline == true">
      Du bsit offline
    </div>
    <CardView
      :employees="employees"
      @del="delEmployee"
      :disabled="this.offline == true"
    ></CardView>
  </div>
</template>

<script>
import ButtonGet from '@/components/ButtonGet.vue';
import CardView from '@/components/CardView.vue';
import axios from 'axios';

export default {
  name: 'app',
  components: {
    ButtonGet,
    CardView,
  },
  data() {
    return {
      employees: [],
      serverAdress: process.env.VUE_APP_SERVER,
      offline: false,
      publicVapidKey:
        'BC29HBw7qCn4Lsm-EDHdoDXWfM68hdSGkCIt04ObJQphH_odZAEHU5KcxK-q038N1SdmgyZPC4uPAHVD7l90ZSs',
    };
  },
  methods: {
    async fetchData() {
      console.log('fetchData called');
      this.employees = (
        await axios.get(`${process.env.VUE_APP_SERVER}/employees`)
      ).data;
    },
    async delEmployee(e) {
      await axios.delete(`${process.env.VUE_APP_SERVER}/employees/${e.id}`);
      this.fetchData();
    },
    async updateAvailable() {
      if (confirm(`New content is available!. Click OK to refresh`)) {
        window.location.reload();
      }
    },
    async subscribe() {
      if (!('serviceWorker' in navigator)) {
        console.log('no service worker!');
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey),
      });
      await axios.post('/subscription', subscription);
    },
    urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
  },
  created() {
    document.addEventListener('swUpdated', this.updateAvailable, {
      once: true,
    });
    window.addEventListener('online', () => (this.offline = false));
    window.addEventListener('offline', () => (this.offline = true));
  },
};
</script>

<style>
.bild {
  width: 30vw;
}
</style>
