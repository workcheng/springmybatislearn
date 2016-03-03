<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>index</title>
</head>
<body>
	<form action="reg">
		<table>
			<tr>
				<td>输入用户名：</td>
				<td><input type="text" name="name"/></td>
			</tr>
			<tr>
				<td>输入密码：</td>
				<td><input type="password" name="pwd"/></td>
			</tr>
			<tr>
				<td>确认密码：</td>
				<td><input type="password" name="pwd1"/></td>
			</tr>
			<tr>
				<td>电子邮箱：</td>
				<td><input type="email" name="email"/></td>
			</tr>
			<tr>
				<td colspan="2">
					<input type="submit" value="注册"/>
					<input type="reset" value="重置"/>
				</td>
			</tr>
		</table>
	</form>
</body>
</html>