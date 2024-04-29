import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GenerateLiElUUID } from "@/utils/common";
import { Link } from "react-router-dom";
import ArticleDialog from "@/components/ArticleDialog";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import CommentCircleIcon from "@/components/svg/CommentCircleIcon";
import { useState } from "react";
import Login from "./Login";
import Article from "@/components/Article";

const Test =  () => {
    const resource = {
        btnText: "생성",
        clickCallback: () =>{
            const file = [...document.getElementById('picture').files];
            alert("save!")
        },
        initFn: () => {}
    }

    return (
        <Article></Article>
    );
};

export default Test;