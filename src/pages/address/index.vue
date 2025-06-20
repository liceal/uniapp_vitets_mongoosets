<template>
  <Layout>
    <template #body>
      <view class="flex flex-col gap-2 w-full">
        <AddressItem v-for="(item, i) in addressesList" :key="item._id" class="w-full" v-bind="item"
          @top="() => onTop(item, i)" @set-default="() => setDefault(item)" @edit="() => addressEdit(item, i)"
          @delete="() => addressDel(item, i)" />
      </view>
      <view class="mt-2 p-2 flex flex-col justify-center items-center gap-2">
        <u-button type="primary" @click="openAddDialog" class="w-full">
          <u-icon name="plus-circle" />
          添加收货地址
        </u-button>
        <u-button type="primary" plain class="w-full">
          从微信添加地址
        </u-button>
      </view>
      <!-- 新增地址 -->
      <u-popup v-model="addDialogVisible" mode="center" :mask-close-able="false" border-radius="5" closeable
        z-index="150">
        <view class="w-80vw p-2">
          <view class="p-2 text-center">{{ { 'add': '添加收货地址', 'edit': '编辑收货地址' }[addType] }}</view>
          <!-- <u-form :model="addressForm" label-width="80px" label-align="right" :rules="rules" ref="addFormRef">
            <u-form-item label="收货人" prop="username" border-bottom>
              <u-input v-model="addressForm.username" clearable placeholder="请填写收货人" />
            </u-form-item>
            <u-form-item label="手机号" prop="phone" border-bottom>
              <u-input v-model="addressForm.phone" clearable placeholder="请填写手机号" />
            </u-form-item>
            <u-form-item label="地区" prop="_address" right-icon="arrow-right" @click="openAddressSelect">
              <u-input v-model="addressForm._address" clearable placeholder="请选择地区" disabled />
            </u-form-item>
            <u-form-item label="详细地址" prop="address">
              <u-input v-model="addressForm.address" type="textarea" clearable placeholder="如街道、门牌号、小区、乡镇、村等" />
              <template #right>
                <view @click="locationClick" class="flex flex-col items-center">
                  <u-icon name="map-fill" size="60" class="text-red-6" />
                  <view class="leading-none">
                    定位
                  </view>
                </view>
              </template>
</u-form-item>
</u-form> -->
          <u-field label="收货人" placeholder="请填写收货人" v-model="addressForm.username" />
          <u-field label="手机号" placeholder="请填写手机号" v-model="addressForm.phone" />
          <view @click="openAddressSelect" class="relative">
            <u-field label="地区" placeholder="请填写地区" disabled v-model="addressForm._address">
              <template #right>
                <u-icon name="arrow-right" class="text-gray" />
              </template>
            </u-field>
            <view class="w-full h-full absolute top-0 left-0 bg-transparent" />
          </view>
          <u-field label="详细地址" placeholder="如街道、门牌号、小区、乡镇、村等" type="textarea" v-model="addressForm.address">
            <template #right>
              <view @click="locationClick">
                <u-icon name="map-fill" size="60" class="text-red-6" />
                <view class="leading-none">
                  定位
                </view>
              </view>
            </template>
          </u-field>
          <u-button type="primary" @click="addSave">保存</u-button>
          <u-select v-model="addressSelectVisible" mode="mutil-column-auto" :list="list" label-name="label"
            value-name="value" child-name="children" @confirm="addressSelectConfirm"></u-select>
        </view>
      </u-popup>

      <!-- 选择位置 -->
      <u-popup v-model="locationVisible" mode="bottom" :mask="false" z-index="200">
        <view class="flex flex-col">
          <view class="text-center text-gray">
            请点击选择地址
          </view>
          <scroll-view scroll-y class="flex-1">
            <view v-for="item in 5" :key="item" class="flex items-center border-top-ef p-2"
              @click="() => locationItemClick(item)">
              <view>
                <view>
                  江东一路与青东一路交叉路口往西约200米
                </view>
                <view class="text-xs text-gray">
                  浙江省杭州市钱塘区江东一路与青东一路交叉路口往西约200米
                </view>
              </view>
              <u-icon name="arrow-right" class="text-gray" />
            </view>
          </scroll-view>
        </view>
      </u-popup>
    </template>
  </Layout>
</template>

<script setup lang='ts'>
import Layout from '@/components/layout/index.vue'
import AddressItem from './addressItem.vue';
import { onMounted, ref } from 'vue';
import addresses from '@/api/addresses';
import type { AddressesTypes } from 'types/server';
import { onReady } from '@dcloudio/uni-app';

const addressesList = ref<AddressesTypes[]>([])
async function getAddressesList() {
  const res = await addresses.list.get()
  addressesList.value = res
}

// 置顶、取消置顶
async function onTop(item: AddressesTypes, index: number) {
  uni.showLoading()
  addresses.top
    .post(item._id)
    .then(res => {
      // 手动挪位置
      // 删除当前的
      let list = [...addressesList.value]
      list.splice(index, 1)
      if (res.is_top) {
        // 置顶 顶部插入
        list.unshift(res)
      } else {
        // 非置顶 插入到 非置顶的第一个
        let noTopFirstIndex = list.length
        list.some((v, i) => {
          if (!v.is_top) {
            noTopFirstIndex = i + 1
            return true
          }
        })
        list.splice(noTopFirstIndex, 0, res)
      }
      addressesList.value = list
      console.log(addressesList.value);

    })
    .finally(() => {
      uni.hideLoading()
    })
}

// 默认地址
async function setDefault(item: AddressesTypes) {
  // 请求接口
  uni.showLoading()
  addresses.setDefault
    .post(item._id)
    .then(res => {
      addressesList.value.forEach(v => {
        if (v._id === item._id) {
          v.is_default = true
        } else {
          return v.is_default = false
        }
      })
    })
    .finally(() => {
      uni.hideLoading()
    })
}

// 添加地址
const addressForm = ref<Partial<AddressesTypes & { _address: string }>>({})
const addDialogVisible = ref(false)
const addressSelectVisible = ref(false)
const locationVisible = ref(false)
const addressEditIndex = ref<number>(0)//临时保存编辑项的下标 用于更新
const addFormRef = ref()
const rules = {
  username: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  _address: [{ required: true, errorType: ['border-bottom'], trigger: "blur" }],
  address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
}
const addType = ref('add')
const list = [
  {
    value: 1,
    label: '浙江',
    children: [
      {
        value: 2,
        label: '杭州',
        children: [
          {
            value: 3,
            label: '滨江区'
          },
          {
            value: 4,
            label: '钱塘区'
          }
        ]
      },
      {
        value: 5,
        label: '温州',
        children: [
          {
            value: 6,
            label: '苍南县'
          },
          {
            value: 7,
            label: '瓯海区'
          }
        ]
      }
    ]
  },
  {
    value: 8,
    label: '广东',
    children: [
      {
        value: 9,
        label: '深圳',
        children: [
          {
            value: 10,
            label: '阿萨的'
          }
        ]
      }
    ]
  }
]
function openAddDialog() {
  addType.value = 'add'
  addressForm.value = {}
  addDialogVisible.value = true
}
function openAddressSelect() {
  addressSelectVisible.value = true
}
function addressSelectConfirm(e: { index: number, value: number, label: string }[]) {
  console.log(e);
  addressForm.value.province = e[0].label
  addressForm.value.city = e[1].label
  addressForm.value.area = e[2].label
  addressForm.value._address = `${addressForm.value.province} ${addressForm.value.city} ${addressForm.value.area}`
}
function locationClick() {
  locationVisible.value = true
}
function locationItemClick(item: any) {
  addressForm.value.address = item + '江东一路与青东一路交叉路口往西约200米'
  locationVisible.value = false
}
function addSave() {
  // addFormRef.value.validate((valid: boolean) => {
  //   console.log(valid);

  //   if (valid) {

  //   }
  // })
  if (!addressForm.value.username) {
    uni.showToast({
      icon: 'none',
      title: '请填写收货姓名'
    })
    return
  }
  if (!addressForm.value.phone) {
    uni.showToast({
      icon: 'none',
      title: '请填写手机号'
    })
    return
  }
  if (!addressForm.value._address) {
    uni.showToast({
      icon: 'none',
      title: '请选择地区'
    })
    return
  }
  if (!addressForm.value.address) {
    uni.showToast({
      icon: 'none',
      title: '详细地址不能为空'
    })
    return
  }
  uni.showLoading()
  if (addType.value === 'add') {
    addresses.create
      .post(addressForm.value)
      .then(res => {
        addressesList.value.push(res)
        addDialogVisible.value = false
      })
      .finally(() => {
        uni.hideLoading()
      })
  } else {
    addresses.update
      .put(addressForm.value, addressForm.value._id)
      .then(res => {
        addressesList.value.splice(addressEditIndex.value, 1, res)
        addDialogVisible.value = false
      })
      .finally(() => {
        uni.hideLoading()
      })
  }
}
// 编辑地址
function addressEdit(item: AddressesTypes, index: number) {
  addType.value = 'edit'
  addressEditIndex.value = index
  addressForm.value = { ...item }
  addressForm.value._address = `${item.province} ${item.city} ${item.area}11`
  addDialogVisible.value = true
}
// 删除地址
function addressDel(item: AddressesTypes, index: number) {
  uni.showModal({
    content: '确定要删除该地址吗？',
    confirmText: '确定', // 默认为"确定"
    cancelText: '取消', // 默认为"取消"
    success: (res) => {
      if (res.confirm) {
        uni.showLoading()
        addresses.delete
          .delete(item._id)
          .then(res => {
            addressesList.value.splice(index, 1)
          })
          .finally(() => {
            uni.hideLoading()
          })
      } else if (res.cancel) {
        console.log('用户点击了取消');
      }
    }
  });
}
// onReady(() => {
//   addFormRef.value.setRules(rules)
// })
onMounted(() => {
  getAddressesList()
})
</script>

<style lang='scss' scoped></style>