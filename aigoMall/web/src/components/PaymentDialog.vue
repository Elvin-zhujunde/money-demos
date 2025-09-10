<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="400px"
    :show-close="false"
    class="payment-dialog"
  >
    <div class="payment-content">
      <div class="payment-header">
        <span class="amount">¥{{ formattedAmount }}</span>
      </div>

      <div class="qrcode-wrapper">
        <!-- <div class="qrcode">
          <i class="el-icon-s-order"></i>
          <p>扫码支付</p>
        </div> -->
        <img
          width="100%"
          height="100%"
          v-if="paymentMethod ==2"
          src="./alipay.jpg"
          alt="支付方式"
        />
        <img width="100%" height="100%" v-if="paymentMethod == 1" src="./wx.jpg" alt="支付方式" />
      </div>

      <div class="payment-footer">
        <el-button type="primary" :loading="paying" @click="handlePaid">
          {{ paying ? "支付处理中" : "我已完成支付" }}
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "PaymentDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
    formattedAmount() {
      return Number(this.amount).toFixed(2);
    },
    getPaymentIcon() {
      return this.paymentMethod === 1
        ? "https://img01.yzcdn.cn/vant/wechat.png"
        : "https://img01.yzcdn.cn/vant/alipay.png";
    },
  },
  data() {
    return {
      paying: false,
    };
  },
  methods: {
    async handlePaid() {
      this.paying = true;
      // 模拟支付过程
      await new Promise((resolve) => setTimeout(resolve, 1500));
      this.paying = false;
      this.$emit("paid");
    },
    handleCancel() {
      this.dialogVisible = false;
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
.payment-content {
  padding: 20px 0;
  text-align: center;
}

.payment-header {
  margin-bottom: 30px;
}

.payment-header img {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}

.payment-header .amount {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #ff6b35;
}

.qrcode-wrapper {
  padding: 30px 0;
}

.qrcode {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

.qrcode i {
  font-size: 50px;
  color: #999;
  margin-bottom: 10px;
}

.qrcode p {
  color: #666;
  font-size: 14px;
}

.payment-footer {
  margin-top: 30px;
}

.payment-footer .el-button {
  width: 140px;
  margin: 0 10px;
}
</style>
