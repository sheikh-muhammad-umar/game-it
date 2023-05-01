package gameIt.registration.service;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import gameIt.registration.models.User;
import gameIt.registration.models.UserEntity;


@Repository("userRepository")
public interface UserRepository extends CrudRepository<UserEntity, String> {

    UserEntity findByEmailIdIgnoreCase(String emailId);
    
    UserEntity findByUsername(String username);
    
//    @Query("SELECT u FROM User u WHERE u.email = ?1")
//    public UserEntity findByEmail(String email); 
     
    public UserEntity findByResetPasswordToken(String token);
 

}

