ALTER TABLE CustomerOptions ADD  intCustOptionActive INT NULL 

go
update CustomerOptions  set intCustOptionActive =1 where intOptionId >0

go
