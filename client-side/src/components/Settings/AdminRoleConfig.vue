<template>
  <v-card>
    <v-card-title class="primary">
      <v-icon left>mdi-account-cog</v-icon>
      User Permissions
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="userHeaders" :items="users" class="elevation-1">
        <!-- Explicit header template -->
        <template v-slot:header="{ headers }">
          <thead>
            <tr>
              <th
                v-for="header in headers"
                :key="header.value"
                :class="['text-' + header.align || 'start']"
              >
                {{ header.title }}
              </th>
            </tr>
          </thead>
        </template>

        <template v-slot:item.role="{ item }">
          <v-select
            v-model="item.role"
            :items="roles"
            :disabled="!isSuperAdmin || item.id === currentUser.id"
            @change="updateUserRole(item)"
            dense
            outlined
          ></v-select>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
  export default {
    data() {
      return {
        userHeaders: [
          { title: 'Name', value: 'name', align: 'start' },
          { title: 'Email', value: 'email', align: 'start' },
          { title: 'Role', value: 'role', align: 'start' }
        ],
        users: [
          {
            id: 1,
            name: 'Admin User',
            email: 'admin@store.com',
            role: 'superadmin'
          },
          { id: 2, name: 'Manager', email: 'manager@store.com', role: 'admin' },
          {
            id: 3,
            name: 'Content admin',
            email: 'admin@store.com',
            role: 'admin'
          }
        ],
        roles: ['superadmin', 'admin'],
        currentUser: { id: 1, role: 'superadmin' } // Mock current user
      }
    },
    computed: {
      isSuperAdmin() {
        return this.currentUser.role === 'superadmin'
      }
    },

    methods: {
      // User Management
      updateUserRole(user) {
        console.log(`Updated user ${user.name} to role ${user.role}`)
        this.$toast.success(`Updated ${user.name}'s role to ${user.role}`)
      }
    }
  }
</script>
