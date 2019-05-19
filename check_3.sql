SELECT s_name
FROM
  student AS s,
  teacher AS t,
  student_teacher AS st
WHERE
    t.t_name = "Foster" AND
    s.s_id = st.student_id AND
    t.t_id = st.teacher_id;