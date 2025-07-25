import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Plus } from 'lucide-react';
import { BingoService } from '@/services/realBingoService';
import { useToast } from '@/hooks/use-toast';
import type { NewBingo } from '@/services/realBingoService';

interface CreateBingoFormProps {
  onBingoCreated?: () => void;
}

export function CreateBingoForm({ onBingoCreated }: CreateBingoFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    nome: '',
    rangeInicio: '',
    rangeFim: '',
    valorCartela: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!date) {
        toast({
          title: "Erro",
          description: "Selecione a data do bingo",
          variant: "destructive"
        });
        return;
      }

      const rangeInicio = parseInt(formData.rangeInicio);
      const rangeFim = parseInt(formData.rangeFim);
      const quantidadeCartelas = rangeFim - rangeInicio + 1;

      const bingoData: Omit<NewBingo, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: 'admin-default',
        nome: formData.nome,
        quantidadeCartelas,
        rangeInicio,
        rangeFim,
        valorCartela: formData.valorCartela,
        dataBingo: date,
        ativo: true
      };

      await BingoService.create(bingoData);

      toast({
        title: "Sucesso!",
        description: "Bingo criado com sucesso"
      });

      setFormData({ nome: '', rangeInicio: '', rangeFim: '', valorCartela: '' });
      setDate(undefined);
      setOpen(false);
      onBingoCreated?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar bingo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-primary to-primary-glow">
          <Plus size={18} />
          Criar Novo Bingo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Bingo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Bingo</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: Bingo de São João"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rangeInicio">Cartela Inicial</Label>
              <Input
                id="rangeInicio"
                type="number"
                value={formData.rangeInicio}
                onChange={(e) => setFormData(prev => ({ ...prev, rangeInicio: e.target.value }))}
                placeholder="001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rangeFim">Cartela Final</Label>
              <Input
                id="rangeFim"
                type="number"
                value={formData.rangeFim}
                onChange={(e) => setFormData(prev => ({ ...prev, rangeFim: e.target.value }))}
                placeholder="100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorCartela">Valor da Cartela (R$)</Label>
            <Input
              id="valorCartela"
              value={formData.valorCartela}
              onChange={(e) => setFormData(prev => ({ ...prev, valorCartela: e.target.value }))}
              placeholder="5.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data do Bingo</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {formData.rangeInicio && formData.rangeFim && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Total de cartelas: {parseInt(formData.rangeFim) - parseInt(formData.rangeInicio) + 1}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Criando..." : "Criar Bingo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}