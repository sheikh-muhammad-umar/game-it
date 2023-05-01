package gameIt.registration.dao;

import java.util.List;

import gameIt.registration.models.Guardian;
import gameIt.registration.models.Student;
import gameIt.registration.models.User;
import gameIt.registration.models.UserEntity;

public interface StudentDao {

	Student getStudentById(int id);
    List<Student> getAllStudents();
    Student addStudent(Student student, int id);
    Student updateStudent(Student student, int id);
    void deleteStudentById(int id);
    List<Student> getStudentsForGuardian(int id); 

    
    List<Student> getStudentsForUser(UserEntity userEntity);
    List<Student> getStudentsForGuardian(Guardian guardian);	
	
}
