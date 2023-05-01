package gameIt.registration.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import gameIt.registration.dao.GuardianDaoDB.GuardianMapper;
import gameIt.registration.dao.UserDaoDB.UserMapper;
import gameIt.registration.models.Guardian;
import gameIt.registration.models.Student;
import gameIt.registration.models.User;
import gameIt.registration.models.UserEntity;

@Repository
public class StudentDaoDB implements StudentDao {

	@Autowired
	JdbcTemplate jdbc;

	@Override
	public Student getStudentById(int id) {
		try {
			final String SELECT_STUDENT_BY_ID = "SELECT * FROM student WHERE StudentID = ?";
			Student student = jdbc.queryForObject(SELECT_STUDENT_BY_ID, new StudentMapper(), id);
//			student.setUser(getUserForStudent(id));
//			student.setGuardians(getGuardiansForStudent(id));
			return student;
		} catch (DataAccessException ex) {
			return null;
		}
	}

	private UserEntity getUserForStudent(int id) {
		final String SELECT_USER_FOR_STUDENT = "SELECT u.* FROM user u "
				+ "JOIN student S ON S.StudentID = u.userid WHERE S.StudentID = ?";
		return jdbc.queryForObject(SELECT_USER_FOR_STUDENT, new UserMapper(), id);
	}

//	private UserEntity getUserForStudent(int id) {
//		final String SELECT_USER_FOR_STUDENT = "SELECT u.* FROM user u "
//				+ "JOIN student S ON S.StudentID = u.userid WHERE S.StudentID = ?";
//		return jdbc.queryForObject(SELECT_USER_FOR_STUDENT, new UserMapper(), id);
//	}
	
	private List<Guardian> getGuardiansForStudent(int id) {
		final String SELECT_GUARDIANS_FOR_STUDENT = "SELECT g.* FROM guardian g "
				+ "JOIN guardiantostudent sg ON sg.GuardianID = g.GuardianID "
				+ "JOIN user u ON u.userid = g.GuardianID "
				+ "WHERE sg.StudentID = ? AND Deleted IS NULL";
		return jdbc.query(SELECT_GUARDIANS_FOR_STUDENT, new GuardianMapper(), id);
	}

	@Override
	public List<Student> getStudentsForGuardian(int id) {
//			final String SELECT_STUDENTS_FOR_GUARDIAN = "SELECT s.* FROM student s "
//					+ "JOIN guardiantostudent sg ON sg.StudentID = s.StudentID WHERE sg.GuardianID = ?";
			
			final String SELECT_STUDENTS_FOR_GUARDIAN = "SELECT student.* FROM student JOIN guardiantostudent ON guardiantostudent.StudentID = student.StudentID JOIN user ON user.userid = student.StudentID WHERE guardiantostudent.GuardianID = ?";
			
			List<Student> students = jdbc.query(SELECT_STUDENTS_FOR_GUARDIAN, 
	                new StudentMapper(), id);
	        associateUserAndGuardians(students);
	        return students;
	    }

	@Override
	public List<Student> getAllStudents() {
		final String SELECT_ALL_STUDENTS = "SELECT * FROM student";
		List<Student> students = jdbc.query(SELECT_ALL_STUDENTS, new StudentMapper());
		associateUserAndGuardians(students);
		return students;
	}

	private void associateUserAndGuardians(List<Student> students) {
		for (Student student : students) {
//			student.setUser(getUserForStudent(student.getId()));
			
			student.setUserEntity(getUserForStudent(student.getId()));

			student.setGuardians(getGuardiansForStudent(student.getId()));
		}
	}

	@Override
	@Transactional
	public Student addStudent(Student student, int id) {
		final String INSERT_STUDENT = "INSERT INTO student(DOB, NameOfSchool, Diagnoses, CountryLiving, CityName, ProfilePicture, StudentID) "
				+ "VALUES(?,?,?,?,?,?,?)";
		int studentId = (int) student.getUserEntity().getUserid();
		jdbc.update(INSERT_STUDENT, student.getBirthdate(), student.getSchool(), student.getDiagnoses(), student.getCountry(),
				student.getCity(), student.getPhoto(), studentId);

//		int newId = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
//		student.setId(newId);
		student.setId(studentId);
		
		insertStudentGuardian(student, id);
		return student;
	}

	private void insertStudentGuardian(Student student, int id) {
		final String INSERT_STUDENT_GUARDIAN = "INSERT INTO "
				+ "guardiantostudent(StudentID, GuardianID) VALUES(?,?)";
//		for (Guardian guardian : student.getGuardians()) {
//			jdbc.update(INSERT_STUDENT_GUARDIAN, student.getId(), guardian.getId());
//		}
		jdbc.update(INSERT_STUDENT_GUARDIAN, student.getId(), id);
	}

	@Override
	@Transactional
	public Student updateStudent(Student student, int id) {
//		final String UPDATE_STUDENT = "UPDATE student SET NameOfSchool = ?, Diagnoses = ?, CountryLiving = ?, CityName = ?"
//				+ "StudentID = ? WHERE id = ?";
//		jdbc.update(UPDATE_STUDENT, student.getSchool(), student.getDiagnoses(), student.getCountry(),
//				student.getCity(), student.getUser().getId(), student.getId());
		final String UPDATE_STUDENT = "UPDATE student SET DOB = ?, NameOfSchool = ?, Diagnoses = ?, CountryLiving = ?, CityName = ?"
				+ " WHERE StudentID = ?";
		jdbc.update(UPDATE_STUDENT, student.getBirthdate(), student.getSchool(), student.getDiagnoses(), student.getCountry(),
				student.getCity(), student.getId());
		
       return student;
//		final String DELETE_STUDENT_GUARDIAN = "DELETE FROM guardiantostudent WHERE StudentID = ?";
//		jdbc.update(DELETE_STUDENT_GUARDIAN, student.getId());
//		insertStudentGuardian(student, id);
	}

	
	@Override
	@Transactional
	public void deleteStudentById(int id) {
//		final String DELETE_STUDENT_GUARDIAN = "DELETE FROM guardiantostudent WHERE StudentID = ?";
//		jdbc.update(DELETE_STUDENT_GUARDIAN, id);
//
//		final String DELETE_STUDENT = "DELETE FROM student WHERE StudentID = ?";
//		jdbc.update(DELETE_STUDENT, id);
//		
//		final String DELETE_STUDENT_USER = "DELETE FROM user WHERE userid = ?";
//		jdbc.update(DELETE_STUDENT_USER, id);
		
		final String DELETE_USER_STUDENT = "UPDATE user SET Deleted = True WHERE userid = ?";
		jdbc.update(DELETE_USER_STUDENT, id);
	}

	@Override
	public List<Student> getStudentsForUser(UserEntity userEntity) {
		final String SELECT_STUDENTS_FOR_USER = "SELECT * FROM student WHERE StudentID = ?";
		List<Student> students = jdbc.query(SELECT_STUDENTS_FOR_USER, new StudentMapper(), userEntity.getUserid());
		associateUserAndGuardians(students);
		return students;
	}

	@Override
	public List<Student> getStudentsForGuardian(Guardian guardian) {
//		final String SELECT_STUDENTS_FOR_GUARDIAN = "SELECT s.* FROM student s JOIN "
//				+ "guardiantostudent sg ON sg.StudentID = s.StudentID WHERE sg.GuardianID = ?";
		
		final String SELECT_STUDENTS_FOR_GUARDIAN = "SELECT student.* FROM student JOIN guardiantostudent ON guardiantostudent.StudentID = student.StudentID JOIN user u ON u.userid = student.StudentID WHERE guardiantostudent.GuardianID = ? ";
				
		List<Student> students = jdbc.query(SELECT_STUDENTS_FOR_GUARDIAN, new StudentMapper(), guardian.getId());
		associateUserAndGuardians(students);
		return students;
	}

	public static final class StudentMapper implements RowMapper<Student> {

		@Override
		public Student mapRow(ResultSet rs, int index) throws SQLException {
			Student student = new Student();
			student.setId(rs.getInt("StudentID"));
			student.setBirthdate(rs.getDate("DOB"));
			student.setSchool(rs.getString("NameOfSchool"));
			student.setDiagnoses(rs.getString("Diagnoses"));
			student.setCountry(rs.getString("CountryLiving"));
			student.setCity(rs.getString("CityName"));
			student.setPhoto(rs.getString("ProfilePicture"));
			
			return student;
		}
	}

}
