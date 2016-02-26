package com.cheng.dao;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import com.cheng.beans.User;
import com.cheng.dao.impl.UserDAOImpl;

public class UserDAO implements UserDAOImpl{
  private DataSource dataSource;

  public DataSource getDataSource() {
    return dataSource;
  }

  public void setDataSource(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  public void inserUser(User user) {
    String name = user.getName();
    Connection connection = null;
    Statement statement = null;
    
    try {
      connection = dataSource.getConnection();
      statement = connection.createStatement();
      statement.execute(" INSERT INTO `user`(`name`,`created_time`,`last_modified_time`) "
      +" VALUES ('"+name+" ',NOW(),NOW()) ");
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

}
