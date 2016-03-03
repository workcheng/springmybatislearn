package com.cheng.test.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class RegController{

  @RequestMapping("/reg")
  protected ModelAndView handleRequestInternal(HttpServletRequest arg0, HttpServletResponse arg1) throws Exception {
    return new ModelAndView("reg.jsp");
  }
  
  @RequestMapping("/showView")
  public ModelAndView showView(){
    ModelAndView modelAndView = new ModelAndView();  
    modelAndView.setViewName( "reg" );  
    modelAndView.addObject( " 需要放到 model 中的属性名称 " , " 对应的属性值，它是一个对象 " );  
    return modelAndView;  
  }
  
  @RequestMapping("/test")
  public @ResponseBody Object test(){
    Map<String,Object> map = new HashMap<>();
    map.put("name", "chenghui");
    map.put("test", null);
    map.put("id", "");
    return map;
  }
  
}
