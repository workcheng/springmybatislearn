package cn.cheng.mybatis.dao.impl;

import java.util.List;
import java.util.Map;

import com.cheng.beans.User;

public interface UserDao {  
  public List<User> queryUsers(String name) throws Exception;
  public int addUser(User user) throws Exception;
  public User getUserById(int id) throws Exception;
  public void updateUserNameById(Map<String,Object> parameter) throws Exception;
  public int updateNameById(User user) throws Exception;
  public int deleteUserById(int id)throws Exception;
}  
