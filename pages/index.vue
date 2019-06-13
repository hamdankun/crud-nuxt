<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-card>
        <v-card-title class="headline">User Simple CRUD</v-card-title>
        <v-card-text>
          <v-layout v-if="!actionMode">
            <v-flex>
              <v-btn color="primary" @click="onAddNew" v-if="!actionMode" class="btn-add-new">
                Add New User
              </v-btn>
            </v-flex>
            <v-flex md3 lg3 class="filter-attributes">
              <v-select
                  v-model="filterAttribute"
                  :items="filterAttributes"
                  label="Column"
              ></v-select>
            </v-flex>
            <v-flex>
              <v-text-field
                v-model="keyword"
                label="Search"
              />
            </v-flex>
          </v-layout>
          <table class="table-user" border="1" v-if="!actionMode">
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Fullname</th>
                <th>City</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in users">
                  <th>{{ ((page - 1) * 10) + (index + 1) }}</th>
                  <th>{{ user.username }}</th>
                  <th>{{ user.fullname }}</th>
                  <th>{{ user.city }}</th>
                  <th>{{ user.status === 1 ? 'Lajang' : 'Menikah' }}</th>
                  <th>
                    <v-btn color="primary" @click="onEdit(user)">
                      Edit
                    </v-btn>
                    <v-btn color="error" @click="onDelete(user)">
                      Delete
                    </v-btn>
                  </th>
                </tr>
            </tbody>
          </table>
          <div class="text-xs-right pagination" v-if="!actionMode">
            <v-pagination
              v-model="currentPage"
              :length="paginationLength"
              @input="onPaginationChange"
            ></v-pagination>
          </div>
          <v-form v-if="actionMode" class="form-user">
            <v-layout>
              <v-flex md6 lg6>
                <h2>FORM USER</h2>
              </v-flex>
              <v-flex md6 lg6 class="float-right">
                <v-btn @click="onCloseForm" color="info">Tutup</v-btn>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex>
                <v-text-field
                    v-model="user.username"
                    :rules="rule.username"
                    :counter="100"
                    label="Username"
                    required
                />
                <v-text-field
                    v-model="user.password"
                    :rules="!user.id ? rule.password : []"
                    label="Password"
                    required
                    type="password"
                />
                <v-text-field
                    v-model="user.fullname"
                    :rules="rule.fullname"
                    label="Fullname"
                    required
                />
                <v-text-field
                    v-model="user.city"
                    :rules="rule.city"
                    label="City"
                    required
                />
                <v-select
                    v-model="user.status"
                    :rules="rule.status"
                    :items="statuses"
                    item-text="title"
                    item-value="id"
                    label="Status"
                ></v-select>
                <v-flex>
                  <v-btn @click="onSubmit" :disabled=" user.username ===  '' || user.password ===  '' || user.fullname ===  '' || user.city ===  '' || user.status ===  ''">Submit</v-btn>
                  <v-btn @click="onReset" color="error">Reset</v-btn>
                </v-flex>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data() {
    return {
      actionMode: false,
      keyword: '',
      currentPage: 1,
      filterAttribute: 'All',
      filterAttributes: [
        'All',
        'Username',
        'Fullname',
        'City',
        'Status'
      ],
      user: {
        id: null,
        username: null,
        password: null,
        fullname: null,
        city: null,
        status: null
      },
      rule: {
        username: [
          v => !!v || 'Username is required',
        ],
        password: [
          v => !!v || 'Password is required',
        ],
        fullname: [
          v => !!v || 'Fullname is required',
        ],
        city: [
          v => !!v || 'City is required',
        ],
        status: [
          v => !!v || 'Status is required',
        ]
      },
      statuses: [
        { id: 1, title: 'Lajang' },
        { id: 2, title: 'Menikah' }
      ]
    }
  },
  computed: {
    ...mapState({
      proses: state => state.users.proses,
      page: state => state.users.page,
      users: state => state.users.data,
      count: state => state.users.count,
      perPage: state => state.users.perPage
    }),
    paginationLength() {
      let user = this.$store.state.users
      return Math.ceil(user.count / user.perPage)
    }
  },
  methods: {
    ...mapActions({
      getUser: 'users/get',
      createUser: 'users/create',
      updateUser: 'users/update',
      destroyUser: 'users/destroy'
    }),
    onAddNew() {
      this.actionMode = true
    },
    onEdit(user) {
      this.user = { ...user }
      this.actionMode = true
    },
    onDelete(user) {
      if (confirm('Apakah Anda Yakin ?')) {
        this.destroyUser({ id: user.id })
      }
    },
    onSubmit(e) {
      let callback = () => { 
        this.actionMode = false
        this.onReset()
      }
      if (this.user.id) {
        this.updateUser({ user: this.user, callback })
      } else {
        this.createUser({ user: this.user, callback })
      }
    },
    onReset() {
      this.resetUsetState()
    },
    onCloseForm() {
      this.actionMode = false
      this.resetUsetState()
    },
    resetUsetState() {
      this.user = {
        id: null,
        username: null,
        password: null,
        fullname: null,
        city: null,
        status: null
      }
    },
    onPaginationChange() {
      this.getUser({ page: this.currentPage })
    }
  },
  created() {
    this.currentPage = this.page
    this.getUser({ page: this.page })
    this.$watch('keyword', (newVal, oldVal) => {
      let initialPage = 1
      this.getUser({ page: initialPage, keyword: newVal, refColumn: this.filterAttribute.toLowerCase() })
      this.currentPage = initialPage
    });
  }
}
</script>


<style scoped>
  .table-user {
    width: 800px;
    border: 1px solid #dddddd;
    border-collapse: collapse;
  }
  .form-user {
    width: 800px;
  }
  .float-right button {
    float: right;
  }
  .btn-add-new {
    margin-bottom: 20px;
  }
  .pagination {
    margin-top: 20px;
  }
  .filter-attributes {
    margin-right: 10px;
  }
</style>