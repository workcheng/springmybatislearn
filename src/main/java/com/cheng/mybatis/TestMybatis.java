package com.cheng.mybatis;

import java.io.IOException;
import java.io.Reader;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class TestMybatis {

  private static SqlSessionFactoryBuilder sqlSessionFactoryBuilder;  
  private static SqlSessionFactory sqlSessionFactory;
  
  private static void init() throws IOException {  
      String resource = "mybatis-config.xml";  
      Reader reader = Resources.getResourceAsReader(resource);  
      sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();  
      sqlSessionFactory = sqlSessionFactoryBuilder.build(reader);  
  }  
}
