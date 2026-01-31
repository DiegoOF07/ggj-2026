<script setup lang="ts">
interface Props {
  message: string
  title?: string
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-content">
      <h2 class="modal-title">
        {{ title ?? 'Confirmación' }}
      </h2>

      <p class="modal-message">
        {{ message }}
      </p>

      <div class="modal-actions">
        <button class="confirm-btn" @click="onConfirm">
          Sí
        </button>

        <button class="cancel-btn" @click="onCancel">
          No
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #020617;
  color: white;
  padding: 2rem;
  border-radius: 12px;
  min-width: 280px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.modal-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.modal-message {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.confirm-btn {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #22c55e;
  color: white;
  font-weight: bold;
}

.cancel-btn {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #ef4444;
  color: white;
  font-weight: bold;
}
</style>
