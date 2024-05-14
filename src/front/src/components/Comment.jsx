import {Button} from "./ui/button";
import {Textarea} from "./ui/textarea";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import React, {useEffect, useState} from 'react';
import {addCommentReqParam} from "@/utils/Parameter.js";
import {addComment} from "@/utils/API.js";
import {readComment} from "@/utils/API.js";
import {updateComment} from "@/utils/API.js";
import {updateCommentReqParam} from "@/utils/Parameter.js";
import {deleteComment} from "@/utils/API.js";
import {key} from "localforage";
import {data} from "autoprefixer";

const CommentItem = ({id, articleId, realname, email= "temp", createdAt = "now", updatedAt = "now", comments ="test", setComments, commentsList, parentId }) =>{
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [editedComment, setEditedComment] = useState(comments);
    const [replyContent, setReplyContent] = useState('');
    const displayDate = new Date(createdAt) >= new Date(updatedAt) ? createdAt : updatedAt;

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        updateComment(id, updateCommentReqParam(editedComment)).then(response => {
            setIsEditing(false);
            const updatedComments = commentsList.map(comment =>
                comment.id === response.id ? {...comment, ...response} : comment
            );
            setComments(updatedComments);
            alert('댓글 수정이 완료되었습니다.');
        }).catch(error => {
            console.error('Failed to update comment:', error);
            alert('댓글 수정에 실패했습니다.')
        });
    };

    const deleteCommentHandler = () => {
        deleteComment(id).then(() => {
            setComments(prevComments => prevComments.filter(comment => comment.id !== id));
            alert('댓글이 삭제되었습니다.');
        }).catch(error => {
            console.error('Failed to delete comment:', error);
            alert('댓글 삭제에 실패했습니다.');
        });
    };

    const toggleReplying = () => {
        setIsReplying(!isReplying);
    };

    const handleReply = () => {
        addComment(articleId, addCommentReqParam(replyContent, id)) // Here the 'parentId' is passed as the current comment's ID
            .then(response => {
                setComments(prevComments => [...prevComments, response]);
                setReplyContent('');
                setIsReplying(false);
                alert('대댓글이 등록되었습니다.');
            })
            .catch(error => {
                console.error('Error adding reply:', error);
                alert('대댓글 등록에 실패했습니다.');
            });
    };

    return (
        <li className="space-y-4">
            <div className="w-full flex items-start space-x-3">
                <Avatar>
                    <AvatarFallback className="font-bold">hi</AvatarFallback>
                </Avatar>
                <div className="w-full">
                    <div className="w-full flex justify-between items-center">
                        <p className="text-sm font-semibold">{realname || "비회원"}</p>
                        <div className="modi-zone flex gap-2 text-sm">
                            {isEditing ? (
                                <span onClick={handleSaveClick}>edit save</span>
                            ) : (
                                <>
                                    <span onClick={handleEditClick}>edit</span>
                                    {!parentId && <span onClick={toggleReplying}>reply</span>}
                                </>
                            )}
                            <span onClick={deleteCommentHandler}>delete</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">{displayDate}</p>
                    {isEditing ? (
                        <textarea
                            className="mt-1 text-sm w-full"
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                        ></textarea>
                    ) : (
                        <p className="mt-1 text-sm">{comments}</p>
                    )}
                    {isReplying && (
                        <div>
                            <textarea
                                className="mt-1 text-sm w-full"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="대댓글을 입력하세요"
                            ></textarea>
                            <button onClick={handleReply} className="mt-2 bg-blue-500 text-white px-2 py-1">대댓글 등록</button>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};

const Comment = ({articleId}) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (articleId) {
            readComment(articleId).then(
                response => {
                    console.log(response)
                    setComments(response);
                }
            ).catch(error => {
                console.error('Error reading comments: ', error)
                // alert('댓글 조회에 실패했습니다. 다시 시도해주세요')
            })
        }

    }, [articleId])

    const addCommentHandler = () => {
        addComment(articleId, addCommentReqParam(content, null))
            .then(response => {
                console.log('Data:', response); // 여기서 'response'는 이미 API에서 반환된 'response.data'입니다.
                // 성공적으로 댓글이 저장된 경우
                setComments(prevComments => [...prevComments, response]); // 저장된 댓글을 목록에 추가
                setContent(''); // 입력 필드 초기화
                alert('댓글이 등록되었습니다.');
            })
            .catch(error => {
                console.error('Error adding comment:', error);
                alert('댓글 등록에 실패했습니다. 다시 시도해주세요.');
            });
    };

    return (
        <div className="p-4 border-t">
            <ul className="flex flex-col gap-4">
                {
                    comments.map(comment => (
                        <CommentItem key={comment.id} {...comment}
                                     setComments={setComments}
                                     articleId={articleId} commentsList={comments}/>

                    ))
                }
            </ul>
            <Textarea onChange={(ev) => setContent(ev.target.value)} className="mt-4 resize-none"
                      placeholder="댓글을 입력해주세요"></Textarea>
            <Button asChild className="mt-2 bg-black text-white w-full" onClick={addCommentHandler}>
                <div>댓글 등록</div>
            </Button>
        </div>
    );
};

export {
    Comment,
    CommentItem
}