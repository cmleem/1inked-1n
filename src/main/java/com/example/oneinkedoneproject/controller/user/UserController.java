package com.example.oneinkedoneproject.controller.user;

import com.example.oneinkedoneproject.domain.User;
import com.example.oneinkedoneproject.dto.*;
import com.example.oneinkedoneproject.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;
    //1. 유저 프로필 조회
    @GetMapping("/api/user")
    public ResponseEntity<FindUserResponseDto> findUser(@ModelAttribute FindUserRequestDto request){
        User user = userService.findUser(request);

        return ResponseEntity.status(HttpStatus.OK)
                .body(new FindUserResponseDto(user));
    }

    //2. 유저 프로필 저장
    @PostMapping("/api/profile")
    public ResponseEntity<String> saveProfile(@RequestPart(value = "dto") SaveProfileRequestDto request, @RequestPart(value ="file") MultipartFile file){
        User user = userService.saveProfile(request, file);

        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("저장에 실패했습니다.");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body("정상적으로 처리되었습니다.");
    }

    //3. 유저 비밀번호 변경
    @PostMapping("/api/password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequestDto request){
        User user = userService.changePassword(request);

        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("변경에 실패하였습니다.");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body("변경에 성공했습니다.");
    }

    //4. 회원 탈퇴
    @PostMapping("/api/withdraw")
    public ResponseEntity<String> withdraw(@RequestBody WithdrawUserRequestDto request){
        User user = userService.withDraw(request);

        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("변경에 실패하였습니다.");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body("변경에 성공했습니다.");
    }

    //5. 회원 가입
    @PutMapping("/api/user")
    public ResponseEntity<String> signup(@RequestBody SignupUserRequestDto request){
        User user = userService.signUp(request);

       if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("회원가입에 실패하였습니다.");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body("회원가입에 성공했습니다.");
    }

    //6. 유저 사진 업로드
    @PostMapping("/api/user/image")
    public ResponseEntity<String> uploadImage(){

    }

}
