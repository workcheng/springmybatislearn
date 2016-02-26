package com.cheng.spring;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.cheng.beans.User;
import com.cheng.dao.UserDAO;

public class Test {

  public static void main(String[] args) {
    Resource resource = new ClassPathResource("applicationContext.xml");
    BeanFactory beanFactory = new XmlBeanFactory(resource);
    User user = new User();
    user.setName("world");
    UserDAO userDAO = (UserDAO) beanFactory.getBean("userDAO");
    userDAO.inserUser(user);
    System.out.println("======");
  }

}
