<template>
  <div>
    <div style="width: 100%; text-align: center;">
      <q-btn-group rounded>
        <q-btn
          rounded no-caps
          label="About"
          :color="activeTab === 'about' ? 'primary' : 'white'"
          :text-color="activeTab === 'about' ? 'white' : 'primary'"
          @click="activeTab = 'about'"
        />
        <q-btn
          rounded no-caps
          label="Dependencies"
          :color="activeTab === 'dependencies' ? 'primary' : 'white'"
          :text-color="activeTab === 'dependencies' ? 'white' : 'primary'"
          @click="activeTab = 'dependencies'"
        />
      </q-btn-group>
    </div>

    <br>

    <div style="width: 100%; text-align: center; max-width: 500px;">
      <div class="animated fadeIn"
           v-show="activeTab === 'about'"
      >
        <h4>{{ packageInfo.productName }} <small>(v. {{ packageInfo.version }})</small></h4>
        <p>{{ packageInfo.description }}</p>

        <br>

        <div class="row q-pa-sm">
          <div class="col-12">
            <b>Source</b>
          </div>
          <div class="col-12">
            <a
              target="_blank"
              :href="packageInfo.homepage"
            >
              {{ packageInfo.homepage }}
            </a>
          </div>
        </div>

        <div class="row q-pa-sm">
          <div class="col-12">
            <b>License</b>
          </div>
          <div class="col-12 ">
            {{ packageInfo.license }}
          </div>
        </div>

        <div class="row q-pa-sm">
          <div class="col-12">
            <b>Author</b>
          </div>
          <div class="col-12">
            {{ packageInfo.author }}
          </div>
        </div>
      </div>
      <div class="animated fadeIn" v-show="activeTab === 'dependencies'">
        <p>{{ packageInfo.productName }} only works because of these libraries</p>

        <br>

        <div class="row">
          <div
            class="col-12"
            v-for="(version, packageName) in dependencieList"
            :key="packageName"
          >
            <a
              target="_blank"
              class="hover-container"
              :href="`https://yarnpkg.com/en/package/${packageName}`"
            >
              {{ packageName }}
              <span class="hover-target">
                {{ clearVersionString(version) }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['packageInfo'],

  data () {
    return {
      activeTab: 'about',
      dependencieList: Object.assign(this.packageInfo.dependencies, this.packageInfo.devDependencies)
    }
  },

  methods: {
    clearVersionString (str) {
      return str.substring(1, str.length)
    }
  }
}
</script>

<style lang="scss" scoped>
.hover-container {
  .hover-target {
    display: none;
  }

  &:hover {
    .hover-target {
      display: inherit;
    }
  }
}
</style>
