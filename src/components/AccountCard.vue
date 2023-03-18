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
              <q-item
                v-close-popup
                clickable
                @click="balanceDialog = true"
              >
                <q-item-section>
                  <q-item-label>Modify Balance</q-item-label>
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
      {{ balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
    </span>

    <q-dialog
      v-model="editDialog"
      persistent
    >
      <q-card style="min-width: 350px">
        <Form
          :initial-values="props"
          :validation-schema="updateAccountSchema"
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
      v-model="balanceDialog"
      persistent
    >
      <q-card style="width: 400px">
        <div class="text-h6 text-weight-bold q-mx-md q-my-md">
          Modify Balance
        </div>

        <div class="row q-px-md q-pb-md">
          <q-btn-toggle
            v-model="incrementOperator"
            flat
            no-caps
            dense
            class="q-my-xs"
            text-color="grey-2"
            toggle-color="primary"
            :options="[
              {label: 'Add', value: 'add'},
              {label: 'Remove', value: 'subtract'}
            ]"
          />
          <q-input
            v-model="incrementAmount"
            filled
            type="number"
            dense
            class="full-width"
          >
            <template #prepend>
              <span class="text-subtitle1">$</span>
            </template>
          </q-input>
          <div class="column">
            <span class="text-grey-2 text-caption q-mt-xs">
              New Balance Preview: {{ balancePreview }}
            </span>
            <div
              v-if="balanceErrors"
              class="text-red text-caption row justify-start"
            >
              <q-icon
                name="error"
                class="q-mr-xs self-center"
              />
              <span class="self-center">Invalid amount</span>
            </div>
          </div>
        </div>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            no-caps
            flat
            label="Cancel"
            color="grey-2"
            @click="balanceErrors = false; incrementAmount = 100"
          />
          <q-btn
            no-caps
            flat
            label="Update"
            color="primary"
            @click="updateBalance"
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
        @close-dialog="importDialog = false"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import ImportDialog from 'components/ImportDialog.vue'
import InputField from 'components/InputField.vue'
import { camelizeKeys } from 'humps'
import { useAccountStore } from 'stores/account-store'
import { Form } from 'vee-validate'
import { computed, ref, toRef } from 'vue'
import { number, object, string } from 'yup'
import { getSubmitFn } from '../helpers/validationHelper'
import { ApiAccountErrors } from '../models/account.model'

interface AccountProps {
  id: number;
  name: string;
  nickname?: string;
  balance: number;
  kind: 'saving' | 'spending';
}

const props = defineProps<AccountProps>()

const updateAccountSchema = object({
  id: number().required(),
  name: string(),
  nickname: string(),
  kind: string<'saving' | 'spending'>()
})

const accountStore = useAccountStore()

const editDialog = ref(false)
const confirmDialog = ref(false)
const importDialog = ref(false)
const balanceDialog = ref(false)

const accountOptions = [
  { label: 'Spending', value: 'spending' },
  { label: 'Saving', value: 'saving' }
]

const accountType = toRef(props, 'kind')
const accountBalance = toRef(props, 'balance')

const incrementOperator = ref<'add' | 'subtract'>('add')
const incrementAmount = ref<number>(100)

const updateErrors = ref<ApiAccountErrors>()

const updateAccountInfo = getSubmitFn(updateAccountSchema, (values) => {
  values.id = props.id
  values.kind = accountType.value
  accountStore.updateAccount(values)
    .then(() => {
      editDialog.value = false
    })
    .catch((error) => {
      updateErrors.value = camelizeKeys(error.response.data)
    })
})

const balancePreview = computed(() => {
  if (incrementOperator.value === 'add') {
    const val = accountBalance.value + Number(incrementAmount.value)
    return val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  } else {
    const val = accountBalance.value - Number(incrementAmount.value)
    return val.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }
})

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

const balanceErrors = ref(false)

function updateBalance () {
  let amount = Number(incrementAmount.value)
  if (isNaN(amount) || amount <= 0 || amount > 100000000) {
    balanceErrors.value = true
  } else {
    if (incrementOperator.value === 'subtract') {
      amount = -Math.abs(amount)
    }
    balanceErrors.value = false
    return accountStore.uploadSingleTransaction(props.id, amount)
      .then(() => {
        balanceDialog.value = false
        incrementAmount.value = 100
      })
      .catch((error) => {
        console.error(error)
        balanceErrors.value = true
      })
  }
}
</script>
