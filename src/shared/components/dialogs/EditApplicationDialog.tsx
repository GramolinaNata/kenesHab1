import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import {
  MOCK_CREDITORS,
  MOCK_TEMPLATES,
} from "@/features/application/constants/application";

interface EditApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApplication: any;
  editForm: any;
  updateApplication: any;
  onSubmit: (data: any) => void;
}

export const EditApplicationDialog: React.FC<EditApplicationDialogProps> = ({
  isOpen,
  onClose,
  selectedApplication,
  editForm,
  updateApplication,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Редактировать заявку
          </DialogTitle>
          <DialogDescription>
            Заявка #{selectedApplication?.id?.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>
        <Form {...editForm}>
          <form
            onSubmit={editForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={editForm.control}
              name="creditor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кредитор (МФО/Банк) *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите кредитора" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_CREDITORS.map((creditor) => (
                        <SelectItem
                          key={creditor.id}
                          value={creditor.id.toString()}
                        >
                          {creditor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма задолженности *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="w-full"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип заявки *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите тип заявки" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_TEMPLATES.map((template) => (
                        <SelectItem
                          key={template.id}
                          value={template.id.toString()}
                        >
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="bank_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email банка/МФО *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комментарий (опционально)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Дополнительная информация о вашей ситуации..."
                      className="min-h-[100px] w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={updateApplication?.isPending}
                className="bg-[#1f74ec] hover:bg-[#1a65d4]"
              >
                {updateApplication?.isPending
                  ? "Сохранение..."
                  : "Сохранить изменения"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
