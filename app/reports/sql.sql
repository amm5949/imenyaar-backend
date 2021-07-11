alter table reports
	add correctness_percent float default 0;
alter table reports
	add parent_id bigint default NULL;
alter table reports
	add constraint parent_id_fk
	foreign key (parent_id) references reports(id)
	on delete set null;
alter table answer_images
    alter column answer_id set default NULL;
alter table answer_voices
    alter column answer_id set default NULL;
alter table answer_voices
	add constraint answer_voices_answer_id_fkey
		foreign key (answer_id) references answers
			on delete cascade;
alter table answer_images
	add constraint answer_images_answer_id_fkey
		foreign key (answer_id) references answers
			on delete cascade;


INSERT INTO resources(id, url, method)
VALUES (301, '/api/reports', 'post'),
       (302, '/api/reports', 'get'),
       (303, '/api/reports/:id', 'get'),
       (304, '/api/reports/:id/files', 'post'),
       (305, '/api/reports/:id', 'put');

INSERT INTO accesses (resource_id, role_id)
VALUES (301, 1),
       (302, 1),
       (303, 1),
       (304, 1),
       (301, 2),
       (302, 2),
       (303, 2),
       (304, 3),
       (301, 3),
       (302, 3),
       (303, 3),
       (304, 3),
       (305, 1),
       (305, 2),
       (305, 3)
       ;
