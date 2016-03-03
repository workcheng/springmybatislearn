<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Insert title here</title>
</head>
<body>
	<table align="center" border="1">
		<tr>
			<td height="23">
				<span class="style2">用户名：</span>
				<span class="style2">${param.name}</span>
			</td>
		</tr>
		<tr>
			<td height="23">
				<span class="style2">密码：</span>
				<span class="style2">${param.pwd}</span>
			</td>
		</tr>
		<tr>
			<td height="23">
				<span class="style2">邮箱：</span>
				<span class="style2">${param.email}</span>
			</td>
		</tr>
		<tr>
			<td colspan="2" height="23" align="center">
				<a href="index.jsp" class="style2">返回</a>
			</td>
		</tr>
	</table>
</body>
</html>