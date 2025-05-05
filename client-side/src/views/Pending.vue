<script setup>
import { onMounted, ref, onUnmounted } from "vue"; 
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import axios from "axios";

const router = useRouter();
const authStore = useAuthStore();

const checking = ref(false);
const error = ref("");
const intervalId = ref(null); 

async function checkApproval() {
    try {
        checking.value = true;

        const response = await axios.get(`http://localhost:5000/auth/check-approval`, {
            params: {
                email: authStore.pendingEmail,
            },
        });

        if (response.data.isApproved) {
            checking.value = false; 
            clearInterval(intervalId.value); 
            authStore.clearPendingEmail();
            router.push("/login");
        } else if (response.data.isRejected) { 
            checking.value = false;
            clearInterval(intervalId.value);
            error.value = "Your account has been rejected by the administrator.";
        }
    } catch (err) {
        console.error("Error checking approval:", err.response?.data || err.message);
        error.value = "Error checking approval. Please try again later.";
    } finally {
        if (!error.value) { 
            checking.value = false;
        }
    }
}

onMounted(() => {
    checkApproval();

    intervalId.value = setInterval(() => {
        checkApproval();
    }, 15000); 
});

onUnmounted(() => {
    clearInterval(intervalId.value); 
});
</script>

<template>
    <v-container fluid class="d-flex flex-column align-center justify-center" style="height: 100vh;">
        <v-card class="pa-5 text-center" elevation="2">
            <h2 class="text-blue m-4">Pending Approval</h2>
            <p>Please wait while the super admin approves your account.</p>
            <!-- <v-progress-circular v-if="checking" indeterminate color="primary" class="mt-4" /> -->
            <p v-if="error" class="text-red mt-4">{{ error }}</p>
            <div style="width: 100%; height: 200px;" class="d-flex align-center justify-center pa-4">
                <v-img src="/pending.png" height="100%" width="100%" contain></v-img>
            </div>


        </v-card>
    </v-container>
</template>