package cn.cheng.mybatis.dao;

import java.io.IOException;
import java.io.Reader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.cheng.beans.User;

import cn.cheng.mybatis.dao.impl.UserDao;

public class Test {
  
  private static SqlSessionFactoryBuilder sqlSessionFactoryBuilder;  
  private static SqlSessionFactory sqlSessionFactory;  
  private static void init() throws IOException {  
      String resource = "config/mybatis-config.xml";  
      Reader reader = Resources.getResourceAsReader(resource);  
      sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();  
      sqlSessionFactory = sqlSessionFactoryBuilder.build(reader);  
  } 

  public List<User> queryUsers(String name) throws Exception {
    init();
//    sqlSessionFactory.getConfiguration().addMapper(UserDao.class);
    SqlSession session= sqlSessionFactory.openSession(); 
    UserDao userDao = session.getMapper(UserDao.class);  
    List<User> users = userDao.queryUsers(name); 
    return users;
  }
  
  public int addUser(User user) throws Exception{
    init();
    SqlSession session= sqlSessionFactory.openSession(); 
    UserDao userDao = session.getMapper(UserDao.class);
    int i = userDao.addUser(user);
    session.commit();
    return i;
  }
  
  public void updateUserNameById(String name,int id) throws Exception{
    init();
    SqlSession session= sqlSessionFactory.openSession(); 
    UserDao userDao = session.getMapper(UserDao.class);
    Map<String,Object> parameter = new HashMap<>();
    parameter.put("name", name);
    parameter.put("id", id);
    userDao.updateUserNameById(parameter);
    session.commit();
  }
  
  public void updateNameById(String name,int id) throws Exception{
    init();
    SqlSession session= sqlSessionFactory.openSession(); 
    UserDao userDao = session.getMapper(UserDao.class);
    User user = new User();
    user.setId(id);
    user.setName(name);
    userDao.updateNameById(user);
    session.commit();
  }
  
  public User getUserById(int id) throws Exception{
    init();
    SqlSession session= sqlSessionFactory.openSession(); 
    UserDao userDao = session.getMapper(UserDao.class);
    return userDao.getUserById(id);
  }
  
  public void deleteUserById(int id) throws Exception{
    init();
    SqlSession session= sqlSessionFactory.openSession(); 
    UserDao userDao = session.getMapper(UserDao.class);
    userDao.deleteUserById(id);
    session.commit();
  }

  public static void main(String []args){
    User user = new User();
    Test test = new Test();
    user.setName("hui");
    try {
      test.queryUsers(user.getName());
      test.updateUserNameById("hui20198", 32);
//      test.deleteUserById(33);
//      test.updateNameById("chenghui", 1);
      User u = test.getUserById(28);
      if(null != u){
        System.out.println(u.toString());
      }
//      System.out.println(test.addUser(user));
      System.out.println(user.getId());
    } catch (Exception e) {
      e.printStackTrace();
    }
    
  }
  
}
