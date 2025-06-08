// api.ts

const apiURL = 'https://bach-remedies-app-production.up.railway.app/';

export interface sintomas {
    sintomas : string[];
}

export class ApiService {
    async getDiagnostics(sintomas: sintomas): Promise<any> {
        console.log('Sintomas enviados para diagnostico:', sintomas);
        if (!sintomas || !sintomas.sintomas || sintomas.sintomas.length === 0) {
            throw new Error('Por favor, informe los sintomas.');
        }
        const response = await fetch(`${apiURL}diagnosticar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sintomas),
        });

        if (!response.ok) {
            throw new Error(`Erro al obtener el diagnostico: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Diagnostico obtenido:', data);
        return data;
    }
}