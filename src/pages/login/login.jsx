import { View, Text, Input, Button } from "@tarojs/components";
import { useState } from "react";
import Taro from "@tarojs/taro";
import "./login.less"; // 引入样式文件

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // 登录处理
  const handleLogin = async () => {
    if (!username || !password) {
      Taro.showToast({
        title: "请输入用户名和密码",
        icon: "none",
      });
      return;
    }

    try {
      const res = await Taro.request({
        url: "http://localhost:3001/toLogin",
        method: "POST",
        data: {
          username,
          password,
        },
      });

      if (res.data === "pwdError") {
        Taro.showToast({
          title: "密码错误",
          icon: "none",
        });
      } else if (res.data === "error") {
        Taro.showToast({
          title: "用户不存在",
          icon: "none",
        });
      } else {
        // 登录成功
        Taro.showToast({
          title: "登录成功",
          icon: "success",
        });
        // 保存用户信息到本地存储
        Taro.setStorageSync("userInfo", res.data);
        Taro.setStorageSync("isLoggedIn", true);
        Taro.switchTab({ url: "/pages/index/index" });
      }
    } catch (error) {
      console.error("登录请求失败:", error);
      Taro.showToast({
        title: "登录失败，请稍后重试",
        icon: "none",
      });
    }
  };

  // 注册处理
  const handleRegister = async () => {
    if (!username || !password) {
      Taro.showToast({
        title: "请输入用户名和密码",
        icon: "none",
      });
      return;
    }

    if (password !== confirmPassword) {
      Taro.showToast({
        title: "两次输入的密码不一致",
        icon: "none",
      });
      return;
    }

    try {
      // 生成一个随机的openid
      const openid = 'user_' + Math.random().toString(36).substr(2, 9);
      
      const res = await Taro.request({
        url: "http://localhost:3001/register",
        method: "POST",
        data: {
          username,
          password,
          openid,
          date: Date.now(), // 使用时间戳数字
          avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0", // 默认头像URL
        },
      });

      if (res.data === "用户名不能重复") {
        Taro.showToast({
          title: "用户名已存在",
          icon: "none",
        });
      } else if (res.data === "success") {
        Taro.showToast({
          title: "注册成功",
          icon: "success",
        });
        setIsLogin(true);
      } else {
        Taro.showToast({
          title: res.data || "注册失败",
          icon: "none",
        });
      }
    } catch (error) {
      console.error("注册请求失败:", error);
      Taro.showToast({
        title: "注册失败，请稍后重试",
        icon: "none",
      });
    }
  };

  return (
    <View className="login-container">
      <View className="login-header">
        <Text className="login-title">{isLogin ? "用户登录" : "用户注册"}</Text>
      </View>
      <View className="login-form">
        <Input
          className="input-item"
          placeholder="请输入用户名"
          value={username}
          onInput={(e) => {
            console.log("用户名输入事件触发:", e.target.value);
            setUsername(e.target.value);
          }}
        />
        <Input
          className="input-item"
          placeholder="请输入密码"
          password
          value={password}
          onInput={(e) => {
            console.log("密码输入事件触发:", e.target.value);
            setPassword(e.target.value);
          }}
        />
        {!isLogin && (
          <Input
            className="input-item"
            placeholder="请再次输入密码"
            password
            value={confirmPassword}
            onInput={(e) => {
              console.log("确认密码输入事件触发:", e.target.value);
              setConfirmPassword(e.target.value);
            }}
          />
        )}
        <Button
          className="login-button"
          onClick={isLogin ? handleLogin : handleRegister}
        >
          {isLogin ? "登录" : "注册"}
        </Button>
      </View>
      <View className="toggle-auth">
        <Text className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "没有账号？点击注册" : "已有账号？点击登录"}
        </Text>
      </View>
    </View>
  );
}
