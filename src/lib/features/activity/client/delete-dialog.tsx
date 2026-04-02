'use client'
import React, { FC, useState } from "react";
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "../../../components/ui/alert-dialog.tsx"
import { Button } from "../../../components/ui/button.tsx"
import { honoClient } from "@/lib/api/main.ts";
import ErrorAlert from "@/lib/components/web/ErrorAlert.tsx";
import { ApplicationException } from "@/lib/types/application-exception.ts";
import { COMMON_ERRORS } from "@/lib/types/error-type.ts";
import { unwrapResponse } from "@/lib/api/response.ts";

const DeleteDialog: FC<{ id: string, title: string, reloadActivity: () => void }> = ({ id, title, reloadActivity }) => {

    const [errorInfo, setErrorInfo] = useState<{ title: number; desc: string } | null>(null);
    const deleteActivity = async (event: React.MouseEvent) => {
        try {
            stopPopup(event);
            const res = await honoClient.api.activity['deleteById'].$delete({ query: {id} });
            const actionResult = await unwrapResponse(res);
            if (actionResult) {
                reloadActivity()
            }
        } catch (error) {
            const message = error instanceof ApplicationException ? error.message : '删除失败';
            const code = error instanceof ApplicationException ? error.code : COMMON_ERRORS.UNKNOWN_ERROR.code;
            setErrorInfo({ title: code, desc: message });
            throw error;
        }
    }

    const stopPopup = (event: React.MouseEvent) => {
        event.stopPropagation();
    }

    return (
        errorInfo ?
            <ErrorAlert title={errorInfo.title} desc={errorInfo.desc} /> :
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" onClick={stopPopup}>删除</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确定删除活动：{title}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            此动作不可逆，请确认
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={stopPopup}>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={deleteActivity}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
    )
}

export default DeleteDialog