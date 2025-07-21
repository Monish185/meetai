
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ResponsiveCommandDialog } from "@/components/ui/command";
import { useState,JSX } from "react";


export const useConfirm = (title: string, description: string): [ () => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
    } | null>(null);

    const confirm = () => {
        return new Promise((resolve) => {
            setPromise({resolve});
        });
    }
    const handleClose = () => {
        setPromise(null);
    }

    const handleConfirm = () => {
        if (promise) {
            promise.resolve(true);
            handleClose();
        }
    }

    const handleCancel = () => {
        if (promise) {
            promise.resolve(false);
            handleClose();
        }
    }

    const ConfirmDialog = () => (
        <>
        <Dialog
            open={promise !== null}
            onOpenChange={handleClose}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
    return [ConfirmDialog , confirm];
}