<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../store/auth";

const router = useRouter();
const authStore = useAuthStore();
const valid = ref(false);
const formRef = ref(null);

const form = ref({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePasswordVisibility = () => (showPassword.value = !showPassword.value);
const toggleConfirmPasswordVisibility = () => (showConfirmPassword.value = !showConfirmPassword.value);

const rules = {
    required: (v) => !!v || "This field is required",
    email: (v) => /.+@.+\..+/.test(v) || "Invalid email",
    phone: (v) => /^01[0-2,5]{1}[0-9]{8}$/.test(v) || "Invalid phone number",
    password: (v) =>
        /^(?=.*[!@#$%^&*])(?=.{8,})/.test(v) || "Min 6 chars & one special character",
    confirmPassword: (v) =>
        v === form.value.password || "Passwords don't match",
};
async function signup() {
    const isValid = await formRef.value.validate();

    if (isValid) {
        try {
            const response = await axios.post("http://localhost:5000/auth/signup", {
                username: form.value.username,
                email: form.value.email,
                phone: form.value.phone,
                password: form.value.password,
            });
            console.log("signUp successful", response.data);
            authStore.setPendingEmail(form.value.email);
            router.push('/pending');
        } catch (error) {
            console.error('Error during signup', error.response?.data || error.message);
        }
    } else {
        console.log(" Form is invalid");
    }
}
console.log("SignUp component loaded");
</script>

<template>
    <v-container fluid class="pa-3">
        <v-row style="min-height: 100vh;">
            <v-col cols="12" sm="5" md="5" lg="5" class="d-none d-sm-flex align-end justify-center rounded-xl"
                style="background-color: #F5F5F5	;">

                <v-img src='/Mobile login-pana.svg' alt='login' cover align-end></v-img>

            </v-col>
            <v-col cols="12" sm="7" md="7" lg="7" class="d-flex align-center justify-center  ">
                <v-card class="auth-card pa-8 w-75 w-sm-75 w-md-75 w-lg-50" elevation-2>
                    <div class="text-center mb-6">
                        <h2>Dukan</h2>
                        <div>
                            welcome !
                        </div>
                        <h2>
                            Sign Up
                        </h2>
                    </div>
                    <v-form ref="formRef" v-model="valid" @submit.prevent="signup">
                        <v-text-field class=" mb-3 custom-label" v-model="form.username" label="username"
                            :rules="[rules.required]" density="compact" variant="outlined" dense autocomplete="off" />
                        <v-text-field class=" mb-3" v-model="form.email" label="Email"
                            :rules="[rules.required, rules.email]" density="compact" variant="outlined" dense
                            autocomplete="off" />
                        <v-text-field class=" mb-3" v-model="form.phone" label="phone"
                            :rules="[rules.required, rules.phone]" variant="outlined" density="compact" dense
                            autocomplete="off" />
                        <v-text-field class=" mb-3" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                            label="password" :rules="[rules.required, rules.password]" variant="outlined"
                            density="compact" dense autocomplete="off">
                            <template #append-inner>
                                <v-icon @click="togglePasswordVisibility" class="cursor-pointer">
                                    {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                                </v-icon>
                            </template></v-text-field>
                        <v-text-field class=" mb-1" v-model="form.confirmPassword" label="Confirm password"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            :rules="[rules.required, rules.confirmPassword]" variant="outlined" density="compact" dense
                            autocomplete="off">
                            <template #append-inner>
                                <v-icon @click="toggleConfirmPasswordVisibility" class="cursor-pointer">
                                    {{ showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                                </v-icon>
                            </template>
                        </v-text-field>
                        <div class="text-center">
                            <router-link v-if="$route.name !== 'login'" to="/login" class=" link-text ">
                                <span class="text-grey">Already have an account?</span>
                                <span class="text-red"> Sign In</span>
                            </router-link>
                        </div>
                        <div class=" text-center">
                            <v-btn type="submit" :disabled="!valid" rounded="lg" size="large" class="mt-4 btn-custom ">
                                Sign UP
                            </v-btn>
                        </div>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

</template>
<style scoped>
.custom-label .v-field-label {
    transition: transform 2s ease, color 1s ease !important;
}

.btn-custom {
    background-color: #88AEFF;
    color: white;
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