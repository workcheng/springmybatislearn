package com.cheng.test;

public class User {
  private int userid;
  private String name;
  public int getUserid() {
    return userid;
  }
  public void setUserid(int userid) {
    this.userid = userid;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  @Override
  public String toString() {
    return "User [userid=" + userid + ", name=" + name + "]";
  }
}
