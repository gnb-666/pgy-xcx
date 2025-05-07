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
  const handleLogin = () => {
    if (Taro) {
      if (username === "admin" && password === "admin") {
        Taro.showToast({
          title: "登录成功",
          icon: "success",
        });
        Taro.setStorageSync("isLoggedIn", true);
        Taro.switchTab({ url: "/pages/index/index" });
      } else {
        Taro.showToast({
          title: "账号或密码错误",
          icon: "none",
        });
      }
    } else {
      console.error("Taro 对象未定义，请检查引入和配置。");
    }
  };

  // 注册处理
  const handleRegister = async () => {
    if (Taro) {
      if (!username || !password) {
        Taro.showToast({
          title: "请输入用户名和密码",
          icon: "none",
        });
        return;
      }

      if (password !== confirmPassword) {
        Taro.showToast({
          title: "两次输入的密码不一致，请重新输入",
          icon: "none",
        });
        return;
      }

      Taro.showToast({
        title: "注册成功",
        icon: "success",
      });
      setIsLogin(true);
    } else {
      console.error("Taro 对象未定义，请检查引入和配置。");
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
