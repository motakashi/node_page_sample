drop database if exists nodesample;
create database nodesample;

use nodesample;

drop table if exists users;
create table users (
  id int unsigned primary key auto_increment,
  mail varchar(225) NOT NULL unique,
  password varchar(225) unique,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);