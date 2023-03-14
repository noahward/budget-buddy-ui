<template>
  <div
    class="bg-grey-1 q-pa-md rounded-borders row justify-between full-width"
  >
    <div class="row">
      <div class="self-center">
        <q-btn
          flat
          round
          icon="more_horiz"
          class="q-mr-sm text-grey-2"
        >
          <q-menu>
            <q-list dense>
              <q-item
                v-close-popup
                clickable
                @click="editDialog = true"
              >
                <q-item-section>
                  <q-item-label>Edit</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="importDialog = true"
              >
                <q-item-section>
                  <q-item-label>Import transactions</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="column">
        <span class="text-subtitle1 text-weight-medium">{{ name }}</span>
        <span class="text-caption text-grey-2">{{ nickname }}</span>
      </div>
    </div>
    <span
      class="text-weight-bold text-primary q-mt-sm"
      :class="$q.screen.lt.sm ? 'text-h6' : 'text-h5'"
    >
      ${{ amount }}
    </span>

    <q-dialog
      v-model="editDialog"
      persistent
    >
      <q-card style="min-width: 350px">
        <Form
          :initial-values="props"
          :validation-schema="accountSchema"
          @submit="updateAccountInfo"
        >
          <div class="text-h6 text-weight-bold q-mx-md q-mt-md">
            Update Account
          </div>
          <q-card-section class="column">
            <q-option-group
              v-model="accountType"
              :options="accountOptions"
              color="primary"
              inline
              class="q-mb-md"
            />
            <div class="column">
              <div class="text-caption1 text-weight-medium q-mb-xs">
                Name
              </div>
              <InputField
                kind="text"
                name="name"
                :errors="updateErrors?.name"
              />
            </div>
            <div class="column">
              <div class="text-caption1 text-weight-medium q-mb-xs">
                Nickname
              </div>
              <InputField
                kind="text"
                name="nickname"
                :errors="updateErrors?.nickname"
              />
            </div>
            <div class="column">
              <div class="text-caption1 text-weight-medium q-mb-xs">
                Balance
              </div>
              <InputField
                kind="text"
                name="amount"
                :errors="updateErrors?.amount"
              />
            </div>
          </q-card-section>
          <q-card-actions class="justify-between">
            <q-btn
              no-caps
              flat
              dense
              class="text-white bg-red-9 q-ml-sm"
              label="Delete Account"
              @click="confirmDialog = true"
            />
            <div>
              <q-btn
                v-close-popup
                no-caps
                flat
                class="text-grey-2"
                label="Cancel"
              />
              <q-btn
                no-caps
                flat
                label="Update"
                type="submit"
                class="text-primary"
              />
            </div>
          </q-card-actions>
        </Form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDialog">
      <q-card>
        <q-card-section class="q-mt-md">
          <span>Are you sure you want to delete this account?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            no-caps
            flat
            label="Cancel"
            color="grey-2"
          />
          <q-btn
            no-caps
            flat
            label="Delete"
            color="red-9"
            @click="deleteAccount(props.id)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="importDialog"
      persistent
    >
      <ImportDialog
        :label="props.name"
        :nickname="props.nickname"
        :value="props.id"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import InputField from 'components/InputField.vue'
import { camelizeKeys } from 'humps'
import { useAccountStore } from 'stores/account-store'
import { Form, FormActions } from 'vee-validate'
import { ref, toRef } from 'vue'
import accountSchema, { Account, ApiAccountErrors } from '../models/account.model'
import ImportDialog from 'components/ImportDialog.vue'

export interface PropTypes {
  id: number;
  name: string;
  nickname?: string;
  amount: number;
  kind: string;
}

const props = withDefaults(defineProps<PropTypes>(), { amount: 0, nickname: '', name: '' })

const accountStore = useAccountStore()
const editDialog = ref(false)
const confirmDialog = ref(false)
const importDialog = ref(false)
const accountOptions = [
  { label: 'Spending', value: 'spending' },
  { label: 'Saving', value: 'saving' }
]

const accountType = toRef(props, 'kind')

const updateErrors = ref<ApiAccountErrors>()

function updateAccountInfo (values: Account, actions: FormActions<Record<string, unknown>>) {
  values.kind = accountType.value
  accountStore.updateAccount(values)
    .then(() => {
      actions.resetForm()
      editDialog.value = false
    })
    .catch((error) => {
      updateErrors.value = camelizeKeys(error.response.data)
    })
}

function deleteAccount (accountId: number) {
  accountStore.deleteAccount(accountId)
    .then(() => {
      editDialog.value = false
    })
    .catch((error) => {
      updateErrors.value = camelizeKeys(error.response.data)
    })
    .finally(() => {
      confirmDialog.value = false
    })
}
</script>
