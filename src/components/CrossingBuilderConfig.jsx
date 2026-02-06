import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from "react-select";
import { getListSymbol, getConfigCrossing, postConfigCrossing } from '../service/FastService';
import '../styles/CrossingBuilderConfig.css';

const CrossingBuilderConfig = () => {
  const [symbols, setSymbols] = useState([]);
  const Timeframes = ['H1', 'H2', 'H3', 'H4', 'D1'];

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      n_totales: 0,
      min_operaciones: 0,
      principal_symbol: "",
      timeframe: "H1",
      por_direccion: false,
    }
  });

  useEffect(() => {
    const fetchSymbols = async () => {
      const symbols = await getListSymbol();
      setSymbols(symbols.symbols || []);
    };
    const fetchConfig = async () => {
      const config = await getConfigCrossing();
        reset({
            n_totales: config.n_totales || 0,
            min_operaciones: config.min_operaciones || 0,
            principal_symbol: config.principal_symbol || "",
            timeframe: config.timeframe || "H1",
            por_direccion: config.por_direccion || false,
        });
    };

    fetchSymbols();
    fetchConfig();
  }, [reset]);

  const opciones = symbols.map(symbol => ({
    value: symbol,
    label: symbol
  }));
  const onSubmit = (data) => {
    postConfigCrossing(data);
    alert('Configuración realizada')
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='myinputs'>
            <div className='input-container'>
            <label>N Totales</label>
            <input type="number" {...register("n_totales")} />
            </div>
            <div className='input-container'>
            <label>Mínimo operaciones</label>
            <input type="number" {...register("min_operaciones")} />
            </div>
            <div className='input-container'>
            <label>Símbolo principal</label>
            <select {...register("principal_symbol")}>
                {opciones.map(opcion => (
                <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                </option>
                ))}
            </select>
            </div>
            <div className='input-container'>
            <label>Time frame</label>
            <select {...register("timeframe")}>
                {Timeframes.map(tf => (
                <option key={tf} value={tf}>
                    {tf}
                </option>
                ))}
            </select>
            </div>
              <div className='input-container'>
                <label>Por dirección</label>
                <input type="checkbox" {...register("por_direccion")} />
            </div>
            <div className="form-actions">
              <input type="submit" value="Configurar" className="btn" />
            </div>
        </div>
      </form>
    </div>
  );
};

export default CrossingBuilderConfig;