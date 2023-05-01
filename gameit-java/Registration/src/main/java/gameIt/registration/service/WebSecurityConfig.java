package gameIt.registration.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.web.client.RestTemplate;

import gameIt.registration.dao.GuardianDao;
import gameIt.registration.dao.StudentDao;
import gameIt.registration.dao.UserDao;
import gameIt.registration.security.jwt.AuthEntryPointJwt;


	@Configuration
	@EnableWebSecurity
	public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
		@Autowired
		private AuthEntryPointJwt unauthorizedHandler;

		
	   
	    @Autowired
	    private DataSource dataSource;
	     
	    @Bean
	    public UserDetailsService userDetailsService() {
	        return new CustomUserDetailsService();
	    }
	     
	    @Bean
	    @Override
	    public AuthenticationManager authenticationManagerBean() throws Exception {
	      return super.authenticationManagerBean();
	    }
 
	    @Bean
	    public DaoAuthenticationProvider authenticationProvider() {
	        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
	        authProvider.setUserDetailsService(userDetailsService());
	        authProvider.setPasswordEncoder(new BCryptPasswordEncoder());
	         
	        return authProvider;
	    }
	 
	    @Override
	    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
	        auth.authenticationProvider(authenticationProvider());
	    }
	 
	    @Override
	    protected void configure(HttpSecurity http) throws Exception {
	    	 http.cors().and().csrf().disable()
	         .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
	         .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
	         .authorizeRequests()
	         .antMatchers("/api/auth/**").permitAll()
	         .antMatchers("/api/student/**").permitAll()
	         .antMatchers("/api/game/**").permitAll()
	         .antMatchers("/api/goal/**").permitAll()
	         .antMatchers("/v2/**").permitAll()
	         .anyRequest().authenticated();
	    	 
	    	 //http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
	    }
	    
	    
	    @Bean
	    public PersistentTokenRepository persistentTokenRepository() {
	        JdbcTokenRepositoryImpl tokenRepo = new JdbcTokenRepositoryImpl();
	        tokenRepo.setDataSource(dataSource);
	        return tokenRepo;
	    }
	    
	    
	    @Bean
    	public PasswordEncoder passwordEncoder() {
    		return new BCryptPasswordEncoder();
    	}

    	// Enable jdbc authentication
    	@Autowired
    	public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
    		auth.jdbcAuthentication().dataSource(dataSource).passwordEncoder(passwordEncoder());
    	}

    	@Bean
    	public JdbcUserDetailsManager jdbcUserDetailsManager() throws Exception {
    		JdbcUserDetailsManager jdbcUserDetailsManager = new JdbcUserDetailsManager();
    		jdbcUserDetailsManager.setDataSource(dataSource);
    		return jdbcUserDetailsManager;
    	}

    	@Override
    	public void configure(WebSecurity web) throws Exception {
    		web.ignoring().antMatchers("/resources/**");
    	}
    	
    	@Bean
    	public RestTemplate restTemplate() {
    		return new RestTemplate();
    	}
	}
