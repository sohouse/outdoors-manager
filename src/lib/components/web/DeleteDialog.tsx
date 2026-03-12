'use client'
import React, { FC } from "react";
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog.tsx"
import { Button } from "../ui/button.tsx"
import { deleteById } from "@/lib/service/activity-service.ts";

const DeleteDialog: FC<{ id: string, title: string, reloadActivity: () => void }> = ({ id, title, reloadActivity }) => {

    const deleteActivity = async (event:React.MouseEvent) => {
        stopPopup(event);
        const actionResult = await deleteById('activity', id);
        if (actionResult) {
            reloadActivity()
        }
    }

    const stopPopup = (event:React.MouseEvent) => {
        event.stopPropagation();
    }

    return (
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