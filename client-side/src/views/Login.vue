<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { useAuthStore } from '../store/auth'

  const router = useRouter()
  const authStore = useAuthStore()
  const formRef = ref(null)
  const loading = ref(false)

  const valid = ref(false)
  const form = ref({
    email: '',
    password: ''
  })

  const rules = {
    required: (v) => !!v || 'This field is required',
    email: (v) => /.+@.+\..+/.test(v) || 'Invalid email',
    min: (v) => v.length >= 6 || 'Minimum 6 characters'
  }

  async function login() {
    const isValid = await formRef.value.validate()

    if (isValid) {
      loading.value = true

      try {
        const response = await axios.post('https://dokan-dashboard.onrender.com/auth/login', {
          email: form.value.email,
          password: form.value.password
        })
        console.log('Login successful:', response.data)

        const token = response.data.data.token // Correct token path
        authStore.setToken(token) // Store token in Pinia

      } catch (error) {
        console.error('login error:', error.response?.data || error.message)
        alert(
          error.response?.data?.message || 'Login failed. Please try again.'
        )
      } finally {
        loading.value = false
      }
    } else {
      console.log('Form is invalid')
    }
  }
</script>

<template>
  <v-container fluid class="pa-3">
    <v-row style="min-height: 100vh">
      <v-col
        cols="12"
        sm="7"
        md="7"
        lg="7"
        class="d-flex align-center justify-center"
      >
        <v-card
          class="auth-card pa-8 w-75 w-sm-75 w-md-75 w-lg-50"
          elevation="2"
        >
          <div class="text-center mb-6">
            <h2>Dukan</h2>
            <div>welcome back!</div>
            <h2>Login</h2>
          </div>

          <v-form v-model="valid" ref="formRef" @submit.prevent="login">
            <v-text-field
              v-model="form.email"
              label="Email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="compact"
              class="mb-3"
              dense
            />
            <v-text-field
              v-model="form.password"
              type="password"
              label="Password"
              :rules="[rules.required, rules.min]"
              variant="outlined"
              density="compact"
              class="mb-4"
              dense
            />
            <div class="text-center">
              <router-link to="/register" class="link-text">
                <span class="text-grey">Don't have an account?</span>
                <span class="text-red"> Sign Up</span>
              </router-link>
            </div>
            <div class="text-center">
              <v-btn
                type="submit"
                :disabled="!valid"
                rounded="lg"
                size="large"
                class="mt-4 btn-custom"
              >
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  size="24"
                  color="white"
                  class="mr-2"
                ></v-progress-circular>
                Login
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="5"
        md="5"
        lg="5"
        class="d-none d-sm-flex align-end justify-center rounded-xl"
        style="background-color: #f5f5f5"
      >
        <v-img
          src="/Mobile login-amico.svg"
          alt="login"
          cover
          align-end
        ></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .btn-custom {
    background-color: #88aeff;
  }

  .link-text {
    font-size: 16px;
    text-decoration: none;
    color: #555;
  }

  .link-text span:last-child {
    color: #e6ccb2;
    font-weight: 600;
  }
</style>
