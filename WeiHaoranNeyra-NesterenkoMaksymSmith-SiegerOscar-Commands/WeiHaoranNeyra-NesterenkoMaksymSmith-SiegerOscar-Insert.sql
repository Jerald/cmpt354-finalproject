INSERT INTO researcher VALUES
(DEFAULT,'Name','Lastname1','email@sfu.ca','SFU'),
(DEFAULT,'Name','Lastname2','email@uvic.ca','UVIC');

INSERT INTO grant_call VALUES
(DEFAULT,'Canadian Inovation',now() + interval '2 week',NULL,'Computer Science',DEFAULT),
(DEFAULT,'Some Title',now() + interval '3 week',NULL,'Biology',DEFAULT),
(DEFAULT,'Reduce Carbon Footprint',now() + interval '4 week',NULL,'Engineering','closed');

INSERT INTO proposal VALUES
(DEFAULT,2,5,'submitt',now(),5000.00,NULL),
(DEFAULT,3,3,'not awarded',now(),5000.00,NULL),
(DEFAULT,3,7,'awarded',now(),5000.00,5000.00);

INSERT INTO collaborator VALUES
(DEFAULT,1,5,'t'),
(DEFAULT,1,1,'f'),
(DEFAULT,2,7,'t'),
(DEFAULT,3,5,'t');

INSERT INTO conflict VALUES
(DEFAULT,1,2,'co-authered paper',now() + interval '2 year'),
(DEFAULT,4,5,'related',NULL),
(DEFAULT,3,7,'Same Department',NULL);

INSERT INTO review VALUES
(DEFAULT,6,3,now(),'t'),
(DEFAULT,7,1,now() + interval '2 week','f'),
(DEFAULT,6,1,now() + interval '2 week','t'),
(DEFAULT,1,2,now(),'t');

INSERT INTO meeting VALUES
(now() + interval '2 week','room 123'),
(now() + interval '2 week','room 312'),
(now() + interval '2 week','room 321');

INSERT INTO meeting_calls VALUES
(1,now() + interval '2 week','123'),
(1,now() + interval '2 week','room 312'),
(1,now() + interval '2 week','room 321');

INSERT INTO meeting_attendees VALUES
(1,now() + interval '2 week','123'),
(1,now() + interval '2 week','room 312'),
(1,now() + interval '2 week','room 321');
