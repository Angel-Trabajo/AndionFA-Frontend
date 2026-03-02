import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'

import { getListSymbol, getGeneralConfig, postGeneralConfig } from '../service/FastService'
import '../styles/NodesCom.css'

const NodesCom = () => {

  const [symbols, setSymbols] = useState([]);
  const [generalConfig, setGeneralConfig] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm();

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListSymbol();
        setSymbols(Array.isArray(data.symbols) ? data.symbols : []);

        const config = await getGeneralConfig();
        setGeneralConfig(config);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  /* ================= DEFAULT VALUES ================= */
  useEffect(() => {
    if (generalConfig?.data) {
      reset({
        symbols: generalConfig.data.list_principal_symbols,
        timeFrame: generalConfig.data.timeframe,
        dateStart: generalConfig.data.dateStart,
        dateEnd: generalConfig.data.dateEnd,
        SimilarityMax: generalConfig.data.SimilarityMax,
        NTotal: generalConfig.data.NTotal,
        MinOperationsIS: generalConfig.data.MinOperationsIS,
        MinOperationsOS: generalConfig.data.MinOperationsOS,
        NumMaxOperations: generalConfig.data.NumMaxOperations,
        MinSuccessRate: generalConfig.data.MinSuccessRate,
        MaxSuccessRate: generalConfig.data.MaxSuccessRate,
        ProgressiveVariation: generalConfig.data.ProgressiveVariation,
        MinOperations: generalConfig.data.min_operaciones,
      });
    }
  }, [generalConfig, reset]);

  /* ================= OPTIONS ================= */
  const symbolOptions = symbols.map(symbol => ({
    value: symbol,
    label: symbol
  }));

  const onSubmit = (data) => {
    alert("Guardando configuración...");
    postGeneralConfig(data)
      .then(response => {
        console.log("Configuration saved successfully:", response); 
        console.log(data);
      })
      .catch(error => {
        console.error("Error saving configuration:", error);
      });
  };

  return (
    <div className="nodes-container">
      <form className='form' onSubmit={handleSubmit(onSubmit)}>

        {/* SYMBOLS */}
        <div>
          <label>Symbols</label>

          <Controller
            name="symbols"
            control={control}
            render={({ field }) => (
              <Select
                options={symbolOptions}
                isMulti
                closeMenuOnSelect={false}
                placeholder="Buscar símbolo..."

                value={symbolOptions.filter(option =>
                  field.value?.includes(option.value)
                )}

                onChange={(selectedOptions) =>
                  field.onChange(
                    selectedOptions
                      ? selectedOptions.map(opt => opt.value)
                      : []
                  )
                }
              />
            )}
          />
        </div>

        <div>
          <label>Date Start OS</label>
          <input type="date" {...register("dateStart")} />
        </div>

        <div>
          <label>Date End OS</label>
          <input type="date" {...register("dateEnd")} />
        </div>


         {/* TIMEFRAME */}
        <div>
          <label htmlFor="timeFrame">Time Frame</label>
          <select id="timeFrame" {...register("timeFrame")}>
            <option value="H1">H1</option>
            <option value="H2">H2</option>
            <option value="H3">H3</option>
            <option value="H4">H4</option>
            <option value="D1">D1</option>
          </select>
        </div>

        <div>
          <label>Similarity Max</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            {...register("SimilarityMax")}
          />
        </div>

        <div>
          <label>NTotal</label>
          <input type="number" {...register("NTotal", { valueAsNumber: true })} />
        </div>

        <div>
          <label>Min Operations IS</label>
          <input type="number" {...register("MinOperationsIS", { valueAsNumber: true })} />
        </div>

        <div>
          <label>Min Operations OS</label>
          <input type="number" {...register("MinOperationsOS", { valueAsNumber: true })} />
        </div>

        <div>
          <label>Max Operations</label>
          <input type="number" {...register("NumMaxOperations", { valueAsNumber: true })} />
        </div>

        <div>
          <label>Min Success Rate</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            {...register("MinSuccessRate", { valueAsNumber: true })}
          />
        </div>

        <div>
          <label>Max Success Rate</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            {...register("MaxSuccessRate", { valueAsNumber: true })}
          />
        </div>

        <div>
          <label>Progre Variation</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            {...register("ProgressiveVariation", { valueAsNumber: true })}
          />
        </div>

        <div>
          <label>Min Operations</label>
          <input type="number" {...register("MinOperations", { valueAsNumber: true })} />
        </div>

        <div className="submit-container">
          <button type="submit">
            Cargar configuración
          </button>
        </div>

      </form>
    </div>
  );
};

export default NodesCom;